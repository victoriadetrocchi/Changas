const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const bcrypt = require('bcrypt');

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.message);
    return;
  }
  // Silenciamos el mensaje de conexión exitosa
  connection.release();
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'El backend de Changas App esta vivo!' });
});

// Registro
app.post('/api/registro', async (req, res) => {
  const { nombre, email, password, telefono } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Nombre, email y contrasena son obligatorios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO usuarios (nombre, email, password, telefono) VALUES (?, ?, ?, ?)';

    db.query(sql, [nombre, email, hashedPassword, telefono || null], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'El email ya esta registrado' });
        }
        console.error('Error en MySQL:', err);
        return res.status(500).json({ error: 'Error guardando el usuario' });
      }
      res.status(201).json({ mensaje: 'Usuario creado exitosamente', id: result.insertId });
    });
  } catch (error) {
    console.error('Error al encriptar:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contrasena son obligatorios' });
  }

  const sql = 'SELECT * FROM usuarios WHERE email = ?';

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error('Error en MySQL:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const usuario = results[0];

    try {
      const contrasenaValida = await bcrypt.compare(password, usuario.password);

      if (!contrasenaValida) {
        return res.status(401).json({ error: 'Credenciales incorrectas' });
      }

      res.status(200).json({
        mensaje: 'Login exitoso',
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        }
      });
    } catch (error) {
      console.error('Error al comparar contrasenas:', error);
      res.status(500).json({ error: 'Error procesando la seguridad' });
    }
  });
});

// Obtener todos los trabajos del Tablon
app.get('/api/trabajos', (req, res) => {
  const sql = 'SELECT * FROM trabajos ORDER BY fecha_publicacion DESC';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error obteniendo trabajos:', err);
      return res.status(500).json({ error: 'Error de base de datos' });
    }
    const trabajosMapeados = results.map(t => ({ ...t, id: t.id.toString() }));
    res.status(200).json(trabajosMapeados);
  });
});

// Publicar un trabajo
app.post('/api/trabajos', (req, res) => {
  const { usuario_id, titulo, ubicacion, tiempo, rubro } = req.body;

  if (!titulo || !ubicacion || !rubro) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  const tiempoReal = tiempo || 'hace un momento';
  const idDueno = usuario_id || 1;

  const sql = 'INSERT INTO trabajos (usuario_id, titulo, ubicacion, tiempo, rubro) VALUES (?, ?, ?, ?, ?)';

  db.query(sql, [idDueno, titulo, ubicacion, tiempoReal, rubro], (err, result) => {
    if (err) {
      console.error('Error guardando trabajo:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    res.status(201).json({ mensaje: 'Trabajo publicado', id: result.insertId });
  });
});

// Postularse a un trabajo
app.post('/api/postular', (req, res) => {
  const { trabajo_id, usuario_id, mensaje, presupuesto } = req.body;

  if (!trabajo_id || !usuario_id) {
    return res.status(400).json({ error: 'Faltan datos para la postulacion' });
  }

  const sql = 'INSERT INTO postulaciones (trabajo_id, usuario_id, mensaje, presupuesto) VALUES (?, ?, ?, ?)';

  db.query(sql, [trabajo_id, usuario_id, mensaje, presupuesto], (err, result) => {
    if (err) {
      console.error('Error al guardar postulacion:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    res.status(201).json({ mensaje: 'Postulacion enviada con exito!' });
  });
});

// Mis avisos (trabajos publicados por el cliente)
app.get('/api/mis-solicitudes/:usuario_id', (req, res) => {
  const usuario_id = req.params.usuario_id;
  const sql = 'SELECT * FROM trabajos WHERE usuario_id = ? ORDER BY fecha_publicacion DESC';

  db.query(sql, [usuario_id], (err, results) => {
    if (err) {
      console.error('Error al obtener mis avisos:', err);
      return res.status(500).json({ error: 'Error interno' });
    }
    const trabajosMapeados = results.map(t => ({
      ...t,
      id: t.id.toString(),
      descripcion: t.rubro
    }));
    res.status(200).json(trabajosMapeados);
  });
});

// Mis postulaciones (trabajos a los que se postuló el profesional)
app.get('/api/mis-postulaciones/:usuario_id', (req, res) => {
  const usuario_id = req.params.usuario_id;

  const sql = `
    SELECT 
      p.id AS postulacion_id, p.mensaje, p.fecha,
      t.id AS trabajo_id, t.titulo, t.ubicacion, t.rubro, t.usuario_id AS cliente_id
    FROM postulaciones p
    JOIN trabajos t ON p.trabajo_id = t.id
    WHERE p.usuario_id = ?
    ORDER BY p.fecha DESC
  `;

  db.query(sql, [usuario_id], (err, results) => {
    if (err) {
      console.error('Error al obtener mis postulaciones:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    res.status(200).json(results);
  });
});

// Eliminar una postulacion
app.delete('/api/postular/:id', (req, res) => {
  const idPostulacion = req.params.id;
  const sql = 'DELETE FROM postulaciones WHERE id = ?';

  db.query(sql, [idPostulacion], (err, result) => {
    if (err) {
      console.error('Error al eliminar postulacion:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    res.status(200).json({ mensaje: 'Postulacion eliminada con exito' });
  });
});

// Registrar perfil de prestador
app.post('/api/servicios', (req, res) => {
  const { usuario_id, categoria, descripcion, radio, dias, experiencia, zona } = req.body;

  if (!usuario_id || !categoria || !descripcion) {
    return res.status(400).json({ error: 'Faltan la categoria o la descripcion' });
  }

  const sql = `
    INSERT INTO servicios_ofrecidos 
    (usuario_id, categoria, descripcion, radio_cobertura_km, dias_disponibilidad, anios_experiencia, zona_base) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [usuario_id, categoria, descripcion, radio || 10, dias || '', experiencia || 0, zona || ''], (err, result) => {
    if (err) {
      console.error('Error al registrar servicio:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    res.status(201).json({ mensaje: 'Perfil profesional creado con exito!' });
  });
});

// Directorio de profesionales
app.get('/api/profesionales', (req, res) => {
  const sql = `
    SELECT 
      u.id AS usuario_id, u.nombre, u.verificado,
      s.categoria, s.descripcion, s.radio_cobertura_km, s.anios_experiencia, s.zona_base
    FROM usuarios u
    JOIN servicios_ofrecidos s ON u.id = s.usuario_id
    ORDER BY s.fecha_registro DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener profesionales:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    const profesionales = results.map(p => ({ ...p, usuario_id: p.usuario_id.toString() }));
    res.status(200).json(profesionales);
  });
});

// Eliminar perfil de prestador
app.delete('/api/servicios/:usuario_id', (req, res) => {
  const usuario_id = req.params.usuario_id;
  const sql = 'DELETE FROM servicios_ofrecidos WHERE usuario_id = ?';

  db.query(sql, [usuario_id], (err, result) => {
    if (err) {
      console.error('Error al eliminar el perfil profesional:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    if (result.affectedRows > 0) {
      res.status(200).json({ mensaje: 'Perfil profesional dado de baja con exito' });
    } else {
      res.status(404).json({ mensaje: 'No se encontro un perfil profesional para este usuario' });
    }
  });
});

// Postulantes a un aviso
app.get('/api/solicitudes/:id/postulantes', (req, res) => {
  const trabajoId = req.params.id;

  const sql = `
    SELECT 
      p.id AS postulacion_id, p.mensaje, p.fecha,
      u.nombre AS profesional_nombre, u.id AS profesional_id, u.verificado,
      s.categoria, s.anios_experiencia
    FROM postulaciones p
    JOIN usuarios u ON p.usuario_id = u.id
    LEFT JOIN servicios_ofrecidos s ON u.id = s.usuario_id
    WHERE p.trabajo_id = ?
    ORDER BY p.fecha DESC
  `;

  db.query(sql, [trabajoId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error interno' });
    res.status(200).json(results);
  });
});

// Calificar a un profesional
app.post('/api/calificaciones', (req, res) => {
  const { trabajo_id, cliente_id, profesional_id, puntuacion, comentario } = req.body;

  if (!trabajo_id || !cliente_id || !profesional_id || !puntuacion) {
    return res.status(400).json({ error: 'Faltan datos obligatorios para calificar' });
  }

  if (puntuacion < 1 || puntuacion > 5) {
    return res.status(400).json({ error: 'La puntuacion debe ser entre 1 y 5' });
  }

  const sql = 'INSERT INTO calificaciones (trabajo_id, cliente_id, profesional_id, puntuacion, comentario) VALUES (?, ?, ?, ?, ?)';

  db.query(sql, [trabajo_id, cliente_id, profesional_id, puntuacion, comentario || ''], (err, result) => {
    if (err) {
      console.error('Error al guardar calificacion:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    res.status(201).json({ mensaje: 'Calificacion enviada con exito!' });
  });
});

// Chat en tiempo real con Socket.io (Silenciado)
io.on('connection', (socket) => {
  socket.on('unirse_sala', (sala_id) => {
    socket.join(sala_id);
  });

  socket.on('enviar_mensaje', (data) => {
    io.to(data.sala_id).emit('nuevo_mensaje', data);
  });

  socket.on('disconnect', () => {
    // Silenciado
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  // Este es el único mensaje que vas a ver al prender
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
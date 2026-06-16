import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Link } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Postulacion = {
  id: string;
  titulo: string;
  ubicacion: string;
  rubro: string;
  mensaje: string;
  presupuesto: string;
};

export default function PantallaPerfil() {
  const router = useRouter();
  
  const [usuario, setUsuario] = useState({ id: null, nombre: 'Cargando...', email: '' });
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [viendoPostulaciones, setViendoPostulaciones] = useState(false);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const datosGuardados = await AsyncStorage.getItem('usuarioInfo');
        if (datosGuardados) {
          setUsuario(JSON.parse(datosGuardados));
        }
      } catch (error) {
        console.error("Error leyendo la memoria local", error);
      }
    };
    cargarDatos();
  }, []);

  const cargarMisPostulaciones = async () => {
    if (viendoPostulaciones) {
      setViendoPostulaciones(false);
      return;
    }

    setCargando(true);
    setViendoPostulaciones(true);

    try {
      const respuesta = await fetch(`http://localhost:3000/api/mis-postulaciones/${usuario.id}`);
      const datos = await respuesta.json();
      
      if (respuesta.ok) {
        setPostulaciones(datos);
      }
    } catch (error) {
      console.error("Error cargando postulaciones:", error);
    } finally {
      setCargando(false);
    }
  };

  // NUEVA FUNCIÓN: Eliminar Postulación
  const eliminarPostulacion = async (idPostulacion: string) => {
    // Si estuviéramos en un celular real, usaríamos Alert.alert para pedir confirmación.
    // Como estamos en web con Expo, lo hacemos directo para evitar problemas de compatibilidad web.
    try {
      const respuesta = await fetch(`http://localhost:3000/api/postular/${idPostulacion}`, {
        method: 'DELETE',
      });

      if (respuesta.ok) {
        // Filtramos la lista para sacar la que acabamos de borrar sin tener que recargar todo
        setPostulaciones((prev) => prev.filter(p => p.id !== idPostulacion));
      } else {
        console.error('Error del servidor al eliminar');
      }
    } catch (error) {
      console.error('Error de red al eliminar', error);
    }
  };
  
  const verificarYOfrecer = async () => {
    try {
      const datosGuardados = await AsyncStorage.getItem('usuarioInfo');
      if (datosGuardados) {
        const usuarioActual = JSON.parse(datosGuardados);
        
        // Si ya está verificado, va directo al formulario
        if (usuarioActual.verificado) {
          router.push('/ofrecer-servicio');
        } else {
          // Si no, lo mandamos a la pared de seguridad
          router.push('/validar-identidad');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

const darDeBajaServicio = async () => {
    // 1. Definimos qué pasa si el usuario dice que "Sí"
    const ejecutarBaja = async () => {
      try {
        const respuesta = await fetch(`http://localhost:3000/api/servicios/${usuario.id}`, {
          method: 'DELETE',
        });

        if (respuesta.ok) {
          if (Platform.OS === 'web') {
            window.alert("Tu perfil profesional fue eliminado del directorio.");
          } else {
            Alert.alert("Éxito", "Tu perfil profesional fue eliminado del directorio.");
          }
        } else {
          if (Platform.OS === 'web') {
            window.alert("Hubo un error al intentar eliminar el perfil.");
          } else {
            Alert.alert("Error", "Hubo un error al intentar eliminar el perfil.");
          }
        }
      } catch (error) {
        console.error('Error de red al eliminar', error);
      }
    };

    // 2. Preguntamos confirmación dependiendo de si es Web o Celular
    if (Platform.OS === 'web') {
      const confirmar = window.confirm("¿Estás segura de que querés eliminar tu perfil profesional del directorio?");
      if (confirmar) {
        ejecutarBaja();
      }
    } else {
      // Esta es la alerta nativa hermosa que sale en el medio de la pantalla del celular
      Alert.alert(
        "Dar de baja servicio",
        "¿Estás segura de que querés eliminar tu perfil profesional del directorio?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Eliminar", style: "destructive", onPress: ejecutarBaja }
        ]
      );
    }
  };

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem('usuarioInfo');
    router.replace('/login');
  };

  const dibujarPostulacion = ({ item }: { item: Postulacion }) => (
    <View style={styles.postulacionCard}>
      <View style={styles.postulacionHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.postulacionTitle}>{item.titulo}</Text>
          <Text style={styles.postulacionSub}>{item.ubicacion} · {item.rubro}</Text>
        </View>
        
        {/* BOTÓN DE ELIMINAR */}
        <TouchableOpacity 
          style={styles.deleteBtn} 
          onPress={() => eliminarPostulacion(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.presupuestoCaja}>
        <Text style={styles.presupuestoLabel}>Presupuesto ofrecido:</Text>
        <Text style={styles.presupuestoValor}>${item.presupuesto}</Text>
      </View>
      {item.mensaje ? (
        <Text style={styles.mensajeTexto}>"{item.mensaje}"</Text>
      ) : null}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{usuario.nombre.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{usuario.nombre}</Text>
        <Text style={styles.email}>{usuario.email}</Text>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Mi Actividad</Text>
        
        {/* NOMBRE ACTUALIZADO ACÁ */}
        <TouchableOpacity style={styles.menuOption} onPress={() => router.push('/mis-solicitudes')}>
          <View style={styles.iconBox}>
            <Ionicons name="document-text" size={22} color="#FF6600" />
          </View>
          <Text style={styles.optionText}>Mis solicitudes</Text>
          <Ionicons name="chevron-forward" size={20} color="#A1A1AA" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuOption} onPress={cargarMisPostulaciones}>
          <View style={styles.iconBox}>
            <Ionicons name="briefcase" size={22} color="#FF6600" />
          </View>
          <Text style={styles.optionText}>Mis postulaciones</Text>
          <Ionicons name={viendoPostulaciones ? "chevron-down" : "chevron-forward"} size={20} color="#A1A1AA" />
        </TouchableOpacity>

        {viendoPostulaciones && (
          <View style={styles.listaContainer}>
            {cargando ? (
              <ActivityIndicator size="small" color="#FF6600" style={{ margin: 20 }} />
            ) : postulaciones.length === 0 ? (
              <Text style={styles.emptyText}>Todavía no te postulaste a ninguna changa.</Text>
            ) : (
              postulaciones.map((item) => (
                <View key={item.id}>
                  {dibujarPostulacion({ item })}
                </View>
              ))
            )}
          </View>
        )}
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Cuenta</Text>
        <TouchableOpacity style={styles.menuOption} onPress={verificarYOfrecer}>
          <View style={[styles.iconBox, { backgroundColor: '#F3E8FF' }]}>
            <Ionicons name="star" size={22} color="#A855F7" />
          </View>
          <Text style={styles.optionText}>Ofrecer mis servicios</Text>
          <Ionicons name="chevron-forward" size={20} color="#A1A1AA" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuOption} onPress={darDeBajaServicio}>
          <View style={[styles.iconBox, { backgroundColor: '#FEF2F2' }]}>
            <Ionicons name="trash-bin" size={22} color="#EF4444" />
          </View>
          <Text style={[styles.optionText, { color: '#EF4444' }]}>Dar de baja mi servicio</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuOption} onPress={cerrarSesion}>
          <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons name="log-out" size={22} color="#EF4444" />
          </View>
          <Text style={[styles.optionText, { color: '#EF4444' }]}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
        
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F5' },
  header: { backgroundColor: '#FFFFFF', alignItems: 'center', paddingVertical: 40, borderBottomWidth: 1, borderBottomColor: '#E4E4E7' },
  avatarContainer: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#18181B', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: '#FFFFFF' },
  name: { fontSize: 24, fontWeight: '800', color: '#18181B', marginBottom: 4 },
  email: { fontSize: 15, color: '#71717A', marginBottom: 20 },
  menuSection: { marginTop: 25, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#A1A1AA', textTransform: 'uppercase', marginBottom: 10, letterSpacing: 0.5 },
  menuOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#E4E4E7' },
  iconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#FFF7ED', justifyContent: 'center', alignItems: 'center' },
  optionText: { flex: 1, fontSize: 16, color: '#18181B', marginLeft: 15, fontWeight: '500' },
  
  listaContainer: { backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E4E4E7', marginBottom: 15, padding: 15 },
  emptyText: { color: '#71717A', textAlign: 'center', padding: 20, fontStyle: 'italic' },
  postulacionCard: { borderBottomWidth: 1, borderBottomColor: '#F4F4F5', paddingBottom: 15, marginBottom: 15 },
  
  // Nuevo contenedor para poner el título y el tachito en la misma línea
  postulacionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  deleteBtn: { padding: 5, backgroundColor: '#FEF2F2', borderRadius: 8 },
  
  postulacionTitle: { fontSize: 16, fontWeight: '700', color: '#18181B' },
  postulacionSub: { fontSize: 13, color: '#A1A1AA', marginTop: 2, marginBottom: 10 },
  presupuestoCaja: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF7ED', padding: 8, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 10 },
  presupuestoLabel: { fontSize: 12, color: '#FF6600', fontWeight: '600', marginRight: 5 },
  presupuestoValor: { fontSize: 14, color: '#FF6600', fontWeight: '800' },
  mensajeTexto: { fontSize: 14, color: '#52525B', fontStyle: 'italic', backgroundColor: '#F4F4F5', padding: 10, borderRadius: 6 }
});
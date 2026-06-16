import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PantallaLogin() {
  const router = useRouter();

  // Estado para alternar entre Login y Registro
  const [esRegistro, setEsRegistro] = useState(false);

  // Estados para guardar lo que el usuario escribe
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");

  // Estado para mostrar mensajes de error o éxito de la base de datos
  const [mensajeError, setMensajeError] = useState("");

  // FUNCIÓN DE LOGIN REAL
const manejarLogin = async () => {
  setMensajeError(""); 

  try {
    const respuesta = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const datos = await respuesta.json();

    if (respuesta.ok) {
      console.log("Login exitoso:", datos.usuario);

      // NUEVO: Guardamos el usuario en la memoria del celular
      await AsyncStorage.setItem('usuarioInfo', JSON.stringify(datos.usuario));

      router.replace("/(tabs)");
    } else {
      setMensajeError(datos.error);
    }
  } catch (error) {
    setMensajeError("Error al conectar con el servidor");
    console.error(error);
  }
};

  // FUNCIÓN DE REGISTRO REAL
  const manejarRegistro = async () => {
    setMensajeError("");
    
    try {
      const respuesta = await fetch("http://localhost:3000/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password, telefono }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        console.log("Usuario registrado:", datos);
        // Si se registró bien, lo pasamos a la pantalla de login para que entre
        setEsRegistro(false);
        setMensajeError("¡Registro exitoso! Ahora ingresá con tus datos.");
        setPassword(""); // Limpiamos la clave por seguridad
      } else {
        setMensajeError(datos.error);
      }
    } catch (error) {
      setMensajeError("Error al conectar con el servidor");
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        {/* Título y Subtítulo dinámico */}
        <Text style={styles.logo}>
          Changas<Text style={styles.acentoNaranja}>.</Text>
        </Text>
        <Text style={styles.subtitle}>
          {esRegistro ? "Creá tu cuenta para empezar" : "Ingresá a tu cuenta"}
        </Text>

        {/* Mensaje de error o éxito dinámico */}
        {mensajeError !== "" && (
          <Text 
            style={{ 
              color: mensajeError.includes("exitoso") ? "#16A34A" : "#EF4444", 
              marginBottom: 15, 
              fontWeight: "bold",
              fontSize: 14
            }}
          >
            {mensajeError}
          </Text>
        )}

        {/* Campos del Formulario */}
        {esRegistro && (
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            placeholderTextColor="#A1A1AA"
            value={nombre}
            onChangeText={setNombre}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#A1A1AA"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          placeholderTextColor="#A1A1AA"
          value={password}
          onChangeText={setPassword}
        />

        {esRegistro && (
          <TextInput
            style={styles.input}
            placeholder="Teléfono (opcional)"
            keyboardType="phone-pad"
            placeholderTextColor="#A1A1AA"
            value={telefono}
            onChangeText={setTelefono}
          />
        )}

        {/* Botón Principal: Decide qué función ejecutar */}
        <TouchableOpacity
          style={styles.button}
          onPress={esRegistro ? manejarRegistro : manejarLogin}
        >
          <Text style={styles.buttonText}>
            {esRegistro ? "Registrarme" : "Ingresar"}
          </Text>
        </TouchableOpacity>

        {/* Botón para alternar el modo */}
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => {
            setEsRegistro(!esRegistro);
            setMensajeError(""); // Limpiamos errores al cambiar de pantalla
          }}
        >
          <Text style={styles.toggleText}>
            {esRegistro
              ? "¿Ya tenés cuenta? Ingresá acá"
              : "¿No tenés cuenta? Registrate acá"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },
  formContainer: {
    paddingHorizontal: 30,
  },
  logo: {
    fontSize: 42,
    fontWeight: "900",
    color: "#18181B",
    letterSpacing: -1,
  },
  acentoNaranja: {
    color: "#FF6600",
  },
  subtitle: {
    fontSize: 16,
    color: "#71717A",
    marginTop: 5,
    marginBottom: 40,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#F4F4F5",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 15,
    color: "#18181B",
    borderWidth: 1,
    borderColor: "#E4E4E7",
  },
  button: {
    backgroundColor: "#FF6600",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    boxShadow: "0px 4px 12px rgba(255, 102, 0, 0.3)",
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  toggleButton: {
    marginTop: 24,
    alignItems: "center",
  },
  toggleText: {
    color: "#71717A",
    fontSize: 14,
    fontWeight: "600",
  },
});
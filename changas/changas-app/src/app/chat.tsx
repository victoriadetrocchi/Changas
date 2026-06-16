import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { io } from "socket.io-client";

// Conexión real al servidor
const socket = io('http://localhost:3000');

// Estructura de un mensaje real
type Mensaje = {
  id: string;
  texto: string;
  emisor: string;
  hora: string;
};

export default function PantallaChat() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Sala privada basada en el trabajo
  const salaId = `sala_postulacion_${params.postulacion_id}`;
  const nombreContacto = String(params.nombre_contacto || 'Chat privado');

  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");

  useEffect(() => {
    // 1. Entramos a la sala
    socket.emit('unirse_sala', salaId);

    // 2. Escuchamos mensajes entrantes
    socket.on('nuevo_mensaje', (data) => {
      setMensajes((prev) => [...prev, { 
        id: Date.now().toString() + Math.random(), 
        texto: data.texto, 
        emisor: data.emisor,
        hora: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }]);
    });

    // 3. Limpiamos al salir
    return () => {
      socket.off('nuevo_mensaje');
    };
  }, [salaId]);

  const enviarMensaje = () => {
    if (nuevoMensaje.trim() === "") return;

    // Paquete que viaja al backend
    const dataMensaje = {
      sala_id: salaId,
      texto: nuevoMensaje,
      emisor: 'yo' // MVP: Asumimos que somos "yo" enviando desde este celu
    };

    socket.emit('enviar_mensaje', dataMensaje);
    setNuevoMensaje(""); // Limpia el input
  };

  const dibujarBurbuja = ({ item }: { item: Mensaje }) => {
    const esMio = item.emisor === 'yo';
    return (
      <View
        style={[
          styles.burbujaContenedor,
          esMio ? styles.burbujaMia : styles.burbujaDeOtro,
        ]}
      >
        <Text
          style={[
            styles.textoMensaje,
            esMio ? styles.textoMio : styles.textoDeOtro,
          ]}
        >
          {item.texto}
        </Text>
        <Text
          style={[
            styles.horaMensaje,
            esMio ? styles.horaMia : styles.horaDeOtro,
          ]}
        >
          {item.hora}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      {/* Cabecera del Chat */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#18181B" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{nombreContacto}</Text>
          <Text style={styles.headerSub}>En línea</Text>
        </View>

        <View style={{ flexDirection: "row", gap: 15, alignItems: "center" }}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="call-outline" size={22} color="#18181B" />
          </TouchableOpacity>

          {/* Botón que lleva a la pantalla de Calificar pasándole el nombre */}
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push({
              pathname: '/calificar',
              params: { nombre: nombreContacto }
            })}
          >
            <Ionicons name="star" size={22} color="#FF6600" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de Mensajes Reales */}
      <FlatList
        data={[...mensajes].reverse()} // Damos vuelta los mensajes
        inverted // Le avisa a React Native que empiece desde abajo
        keyExtractor={(item) => item.id}
        renderItem={dibujarBurbuja}
        contentContainerStyle={{ paddingTop: 30, paddingBottom: 20 }}
      />

      {/* Barra para Escribir */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          placeholderTextColor="#A1A1AA"
          value={nuevoMensaje}
          onChangeText={setNuevoMensaje}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={enviarMensaje}>
          <Ionicons name="send" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 50, paddingBottom: 15, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: "#E4E4E7", backgroundColor: "#FFFFFF" },
  backButton: { padding: 5 },
  actionButton: { padding: 5 },
  headerInfo: { flex: 1, alignItems: "center" },
  headerTitle: { fontSize: 16, fontWeight: "800", color: "#18181B" },
  headerSub: { fontSize: 12, color: "#71717A", marginTop: 2 },
  burbujaContenedor: { maxWidth: "80%", padding: 12, borderRadius: 16, marginBottom: 10, marginHorizontal: 15 },
  burbujaMia: { alignSelf: "flex-end", backgroundColor: "#FF6600", borderBottomRightRadius: 4 },
  burbujaDeOtro: { alignSelf: "flex-start", backgroundColor: "#F4F4F5", borderBottomLeftRadius: 4 },
  textoMensaje: { fontSize: 15, lineHeight: 20 },
  textoMio: { color: "#FFFFFF" },
  textoDeOtro: { color: "#18181B" },
  horaMensaje: { fontSize: 10, marginTop: 5, alignSelf: "flex-end" },
  horaMia: { color: "rgba(255, 255, 255, 0.7)" },
  horaDeOtro: { color: "#A1A1AA" },
  inputContainer: { flexDirection: "row", alignItems: "center", padding: 10, paddingBottom: Platform.OS === "ios" ? 25 : 10, borderTopWidth: 1, borderTopColor: "#E4E4E7", backgroundColor: "#FFFFFF" },
  input: { flex: 1, backgroundColor: "#F4F4F5", borderRadius: 20, paddingHorizontal: 15, paddingTop: 10, paddingBottom: 10, fontSize: 15, color: "#18181B", maxHeight: 100 },
  sendButton: { backgroundColor: "#FF6600", width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center", marginLeft: 10, shadowColor: "#FF6600", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 2 }
});
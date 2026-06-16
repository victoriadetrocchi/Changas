import { Ionicons } from "@expo/vector-icons";
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

export default function PantallaCalificacion() {
  const router = useRouter();
  const [estrellas, setEstrellas] = useState(0);
  const [comentario, setComentario] = useState("");

  const simularEnvio = () => {
    // Acá se enviaría la calificación a tu base de datos MySQL
    // Por ahora, volvemos al inicio simulando que terminó el proceso
    router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Cabecera minimalista */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="close" size={28} color="#18181B" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Título y perfil del trabajador */}
        <Text style={styles.title}>¿Cómo fue tu experiencia?</Text>
        <Text style={styles.subtitle}>
          Calificá el trabajo de{" "}
          <Text style={{ fontWeight: "bold", color: "#18181B" }}>
            Juan Pérez
          </Text>
        </Text>

        {/* Selector interactivo de estrellas */}
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((numero) => (
            <TouchableOpacity
              key={numero}
              onPress={() => setEstrellas(numero)}
              style={styles.starButton}
            >
              <Ionicons
                name={numero <= estrellas ? "star" : "star-outline"}
                size={48}
                color={numero <= estrellas ? "#FF6600" : "#E4E4E7"}
              />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.ratingHint}>
          {estrellas === 0 && "Tocá una estrella para calificar"}
          {estrellas === 1 && "Muy mala 😞"}
          {estrellas === 2 && "Mala 😕"}
          {estrellas === 3 && "Regular 😐"}
          {estrellas === 4 && "Buena 🙂"}
          {estrellas === 5 && "¡Excelente! 🤩"}
        </Text>

        {/* Campo para la reseña escrita */}
        <Text style={styles.label}>Dejá un comentario (opcional)</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Ej: Súper puntual y prolijo. Lo recomiendo totalmente."
          placeholderTextColor="#A1A1AA"
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
          value={comentario}
          onChangeText={setComentario}
        />

        {/* Botón de Enviar (solo se habilita si eligió al menos 1 estrella) */}
        <TouchableOpacity
          style={[styles.button, estrellas === 0 && styles.buttonDisabled]}
          onPress={simularEnvio}
          disabled={estrellas === 0}
        >
          <Text style={styles.buttonText}>Publicar reseña</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backButton: {
    alignSelf: "flex-start",
    padding: 5,
    marginLeft: -5,
  },
  content: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#18181B",
    letterSpacing: -0.5,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#71717A",
    marginTop: 8,
    marginBottom: 40,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 15,
  },
  starButton: {
    padding: 5,
  },
  ratingHint: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    color: "#FF6600",
    marginBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#18181B",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  textArea: {
    backgroundColor: "#F4F4F5",
    borderRadius: 8,
    padding: 16,
    fontSize: 15,
    color: "#18181B",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    minHeight: 120,
    marginBottom: 25,
  },
  button: {
    backgroundColor: "#FF6600",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: "auto", // Empuja el botón hacia abajo
    marginBottom: 20,
    boxShadow: "0px 4px 12px rgba(255, 102, 0, 0.3)",
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "#E4E4E7",
    boxShadow: "none",
    elevation: 0,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

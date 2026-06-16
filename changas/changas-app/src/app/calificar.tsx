import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PantallaCalificar() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [estrellas, setEstrellas] = useState(5);
  const [comentario, setComentario] = useState('');

  const enviarCalificacion = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/calificaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trabajo_id: params.trabajo_id || 1, // En un futuro acá va el ID real del trabajo
          cliente_id: 1, // En un futuro acá va el ID de tu usuario logueado
          profesional_id: params.profesional_id || 2, 
          puntuacion: estrellas,
          comentario: comentario
        })
      });

      if (respuesta.ok) {
        Alert.alert('¡Éxito!', 'La calificación se guardó correctamente', [
          { text: 'OK', onPress: () => router.push('/perfil') }
        ]);
      } else {
        Alert.alert('Error', 'Hubo un problema al enviar la calificación');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
  };

  return (
    <View style={styles.container}>
      {/* Cabecera */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#18181B" />
        </TouchableOpacity>
        <Text style={styles.title}>Calificar Servicio</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>¿Cómo fue el trabajo de {params.nombre || 'el profesional'}?</Text>
        
        {/* Selector de Estrellas */}
        <View style={styles.estrellasContainer}>
          {[1, 2, 3, 4, 5].map((num) => (
            <TouchableOpacity key={num} onPress={() => setEstrellas(num)}>
              <Ionicons 
                name={num <= estrellas ? "star" : "star-outline"} 
                size={45} 
                color={num <= estrellas ? "#FFD700" : "#D4D4D8"} 
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Campo de Comentario */}
        <TextInput
          style={styles.input}
          placeholder="Dejá un comentario sobre tu experiencia (opcional)..."
          placeholderTextColor="#A1A1AA"
          multiline
          value={comentario}
          onChangeText={setComentario}
        />

        <TouchableOpacity style={styles.btnEnviar} onPress={enviarCalificacion}>
          <Text style={styles.btnTexto}>Enviar Calificación</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E4E4E7' },
  backButton: { padding: 5 },
  title: { fontSize: 18, fontWeight: '800', color: '#18181B' },
  content: { padding: 20, alignItems: 'center', marginTop: 20 },
  subtitle: { fontSize: 18, fontWeight: '600', color: '#18181B', marginBottom: 20, textAlign: 'center' },
  estrellasContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 30, gap: 10 },
  input: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 15, fontSize: 15, color: '#18181B', minHeight: 120, textAlignVertical: 'top', borderWidth: 1, borderColor: '#E4E4E7', marginBottom: 30 },
  btnEnviar: { backgroundColor: '#FF6600', width: '100%', paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
  btnTexto: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }
});
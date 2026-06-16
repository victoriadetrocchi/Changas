import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PantallaPostular() {
  const router = useRouter();
  const params = useLocalSearchParams(); 
  
  const [mensaje, setMensaje] = useState('');
  const [presupuesto, setPresupuesto] = useState('');
  const [estadoPostulacion, setEstadoPostulacion] = useState('');

  const enviarPostulacion = async () => {
    Keyboard.dismiss(); 
    
    try {
      const datosGuardados = await AsyncStorage.getItem('usuarioInfo');
      
      if (!datosGuardados) {
        setEstadoPostulacion('Error: Tenés que iniciar sesión primero.');
        return;
      }
      
      const usuarioLogueado = JSON.parse(datosGuardados);

      const respuesta = await fetch('http://localhost:3000/api/postular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trabajo_id: params.id || 1,
          usuario_id: usuarioLogueado.id,
          mensaje: mensaje,
          presupuesto: presupuesto
        }),
      });

      if (respuesta.ok) {
        setEstadoPostulacion('¡Postulación enviada con éxito! El cliente se contactará con vos.');
        setTimeout(() => {
          router.replace('/(tabs)'); 
        }, 2000);
      } else {
        setEstadoPostulacion('Hubo un error al enviar tu postulación.');
      }
    } catch (error) {
      setEstadoPostulacion('Error al conectar con el servidor.');
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#18181B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Postularme</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.jobInfoCard}>
          <Text style={styles.jobTitle}>{params.titulo || 'Trabajo seleccionado'}</Text>
          <Text style={styles.jobSub}>Estás a un paso de ofrecer tus servicios para esta changa.</Text>
        </View>

        {/* --- ACÁ INVERTIMOS EL ORDEN --- */}
        <Text style={styles.label}>Mensaje para el cliente (Opcional)</Text>
        <TextInput 
          style={styles.textArea} 
          placeholder="Hola! Tengo experiencia en esto y puedo ir mañana mismo..." 
          placeholderTextColor="#A1A1AA"
          multiline={true}
          numberOfLines={4}
          value={mensaje}
          onChangeText={setMensaje}
          textAlignVertical="top"
        />

        <Text style={styles.label}>Presupuesto estimado ($)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ej: 15000" 
          placeholderTextColor="#A1A1AA"
          keyboardType="numeric"
          value={presupuesto}
          onChangeText={setPresupuesto}
        />
        {/* ------------------------------- */}

        {estadoPostulacion !== '' && (
          <Text style={{ color: estadoPostulacion.includes('éxito') ? 'green' : 'red', marginTop: 10, fontWeight: 'bold', textAlign: 'center' }}>
            {estadoPostulacion}
          </Text>
        )}

        <TouchableOpacity style={styles.button} onPress={enviarPostulacion}>
          <Text style={styles.buttonText}>Enviar postulación</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#E4E4E7' },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#18181B' },
  content: { padding: 20, flex: 1 },
  jobInfoCard: { backgroundColor: '#F4F4F5', padding: 20, borderRadius: 12, marginBottom: 25, borderWidth: 1, borderColor: '#E4E4E7' },
  jobTitle: { fontSize: 18, fontWeight: '800', color: '#18181B', marginBottom: 5 },
  jobSub: { fontSize: 14, color: '#71717A', lineHeight: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#18181B', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: '#F4F4F5', borderRadius: 8, padding: 16, fontSize: 15, color: '#18181B', borderWidth: 1, borderColor: '#E4E4E7', marginBottom: 20 },
  textArea: { backgroundColor: '#F4F4F5', borderRadius: 8, padding: 16, fontSize: 15, color: '#18181B', borderWidth: 1, borderColor: '#E4E4E7', height: 100, marginBottom: 20 },
  button: { 
    backgroundColor: '#FF6600', 
    paddingVertical: 16, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 'auto', 
    marginBottom: 20, 
    boxShadow: '0px 4px 12px rgba(255, 102, 0, 0.3)', 
    elevation: 4,
    zIndex: 10 
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});
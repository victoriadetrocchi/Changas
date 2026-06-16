import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

export default function PantallaValidacion() {
  const router = useRouter();
  const [simulando, setSimulando] = useState(false);

  const simularAprobacion = async () => {
    setSimulando(true);
    try {
      // Leemos los datos actuales
      const datosGuardados = await AsyncStorage.getItem('usuarioInfo');
      if (datosGuardados) {
        const usuario = JSON.parse(datosGuardados);
        
        // Le agregamos la medalla de verificado localmente
        usuario.verificado = true; 
        await AsyncStorage.setItem('usuarioInfo', JSON.stringify(usuario));
        
        // Simulamos un tiempito de carga del servidor y lo mandamos al formulario
        setTimeout(() => {
          router.replace('/ofrecer-servicio');
        }, 1500);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={28} color="#18181B" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="shield-checkmark" size={60} color="#FF6600" />
        </View>
        
        <Text style={styles.title}>Verificá tu identidad</Text>
        <Text style={styles.description}>
          Para mantener la comunidad segura y poder ofrecer tus servicios, necesitamos validar que sos una persona real.
        </Text>

        <View style={styles.pasosContainer}>
          <View style={styles.paso}>
            <Ionicons name="id-card-outline" size={24} color="#18181B" />
            <Text style={styles.pasoTexto}>Foto del frente y dorso de tu DNI</Text>
          </View>
          <View style={styles.paso}>
            <Ionicons name="camera-outline" size={24} color="#18181B" />
            <Text style={styles.pasoTexto}>Una selfie clara de tu rostro</Text>
          </View>
        </View>

        {/* Botón de simulación para el MVP */}
        <TouchableOpacity 
          style={[styles.button, simulando && { backgroundColor: '#A1A1AA' }]} 
          onPress={simularAprobacion}
          disabled={simulando}
        >
          <Text style={styles.buttonText}>
            {simulando ? 'Verificando datos...' : 'Validación'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { padding: 20 },
  backButton: { alignSelf: 'flex-start' },
  content: { paddingHorizontal: 30, flex: 1, justifyContent: 'center', alignItems: 'center' },
  iconContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFF7ED', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '900', color: '#18181B', marginBottom: 10, textAlign: 'center' },
  description: { fontSize: 15, color: '#71717A', textAlign: 'center', lineHeight: 22, marginBottom: 40 },
  pasosContainer: { width: '100%', backgroundColor: '#F4F4F5', borderRadius: 12, padding: 20, marginBottom: 40 },
  paso: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  pasoTexto: { fontSize: 15, fontWeight: '500', color: '#18181B', marginLeft: 15 },
  button: { width: '100%', backgroundColor: '#FF6600', paddingVertical: 16, borderRadius: 8, alignItems: 'center', boxShadow: '0px 4px 12px rgba(255, 102, 0, 0.3)' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});
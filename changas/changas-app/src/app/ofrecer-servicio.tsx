import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Keyboard, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PantallaOfrecerServicio() {
  const router = useRouter();
  
  // Estados para guardar lo que escribe el usuario
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [radio, setRadio] = useState('10'); // 10km por defecto
  const [dias, setDias] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [zona, setZona] = useState('');

  const registrarServicio = async () => {
    Keyboard.dismiss(); 
    
    if (!categoria || !descripcion) {
      setMensaje('Error: La categoría y la descripción son obligatorias.');
      return;
    }

    try {
      const datosGuardados = await AsyncStorage.getItem('usuarioInfo');
      if (!datosGuardados) return;
      const usuarioLogueado = JSON.parse(datosGuardados);

      const respuesta = await fetch('http://localhost:3000/api/servicios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: usuarioLogueado.id,
          categoria: categoria,
          descripcion: descripcion,
          experiencia: parseInt(experiencia) || 0,
          dias: dias,
          zona: zona,
          radio: parseInt(radio) || 10
        }),
      });

      if (respuesta.ok) {
        setMensaje('¡Ya sos parte del directorio de profesionales!');
        setTimeout(() => {
          router.back(); 
        }, 2000);
      } else {
        setMensaje('Hubo un error al registrar tu servicio.');
      }
    } catch (error) {
      setMensaje('Error al conectar con el servidor.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={28} color="#18181B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ficha Técnica</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.description}>
          Completá tu perfil para aparecer en el Directorio. Estos datos le darán más confianza a tus futuros clientes.
        </Text>

        <Text style={styles.label}>Categoría / Rubro principal *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ej: Electricidad, Plomería, Fletes..." 
          placeholderTextColor="#A1A1AA"
          value={categoria}
          onChangeText={setCategoria}
        />

        {/* ZONA BASE - Ahora tiene su propia fila completa */}
        <Text style={styles.label}>Zona base / Barrio *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ej: Centro, Puerto, La Perla..." 
          placeholderTextColor="#A1A1AA"
          value={zona}
          onChangeText={setZona}
        />

        {/* FILA COMPARTIDA - Solo para Experiencia y Radio */}
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Años exp.</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ej: 5" 
              placeholderTextColor="#A1A1AA"
              keyboardType="numeric"
              value={experiencia}
              onChangeText={setExperiencia}
            />
          </View>
          
          <View style={styles.halfInput}>
            <Text style={styles.label}>Radio (km)</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ej: 15" 
              placeholderTextColor="#A1A1AA"
              keyboardType="numeric"
              value={radio}
              onChangeText={setRadio}
            />
          </View>
        </View>

        <Text style={styles.label}>Días y horarios de disponibilidad</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ej: Lunes a Viernes de 8 a 18hs" 
          placeholderTextColor="#A1A1AA"
          value={dias}
          onChangeText={setDias}
        />

        <Text style={styles.label}>Descripción de tu trabajo *</Text>
        <TextInput 
          style={styles.textArea} 
          placeholder="Contale a los clientes qué hacés en detalle..." 
          placeholderTextColor="#A1A1AA"
          multiline={true}
          numberOfLines={4}
          value={descripcion}
          onChangeText={setDescripcion}
          textAlignVertical="top"
        />

        {mensaje !== '' && (
          <Text style={{ color: mensaje.includes('éxito') || mensaje.includes('directorio') ? 'green' : 'red', marginTop: 10, fontWeight: 'bold', textAlign: 'center' }}>
            {mensaje}
          </Text>
        )}

        <TouchableOpacity style={styles.button} onPress={registrarServicio}>
          <Text style={styles.buttonText}>Publicar mi perfil profesional</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#E4E4E7' },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#18181B' },
  content: { padding: 20, flex: 1 },
  description: { fontSize: 15, color: '#71717A', marginBottom: 25, lineHeight: 22 },
  label: { fontSize: 13, fontWeight: '700', color: '#18181B', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: '#F4F4F5', borderRadius: 8, padding: 16, fontSize: 15, color: '#18181B', borderWidth: 1, borderColor: '#E4E4E7', marginBottom: 20 },
  textArea: { backgroundColor: '#F4F4F5', borderRadius: 8, padding: 16, fontSize: 15, color: '#18181B', borderWidth: 1, borderColor: '#E4E4E7', height: 100, marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInput: { width: '48%' },
  button: { backgroundColor: '#18181B', paddingVertical: 16, borderRadius: 8, alignItems: 'center', marginTop: 10, zIndex: 10 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});
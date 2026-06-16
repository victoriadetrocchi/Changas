import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PantallaPublicar() {
  const router = useRouter();
  
  const [titulo, setTitulo] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [rubro, setRubro] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  const manejarPublicacion = async () => {
    setMensajeError('');
    
    if (!titulo || !ubicacion || !rubro) {
      setMensajeError('Por favor completá todos los campos.');
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/trabajos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          ubicacion,
          rubro,
          tiempo: 'hace un momento' // Lo fijamos por defecto para simular tiempo real
        }),
      });

      if (respuesta.ok) {
        // Si se guardó en MySQL, volvemos al Tablón para verlo
        router.replace('/(tabs)');
      } else {
        setMensajeError('Hubo un error al publicar el trabajo.');
      }
    } catch (error) {
      setMensajeError('Error al conectar con el servidor.');
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={28} color="#18181B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Publicar</Text>
        <View style={{ width: 28 }} /> 
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Describí qué necesitás arreglar o hacer para que los profesionales te contacten.
        </Text>

        {mensajeError !== '' && (
          <Text style={styles.errorText}>{mensajeError}</Text>
        )}

        <Text style={styles.label}>Título</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ej: Instalar ventilador de techo" 
          placeholderTextColor="#A1A1AA"
          value={titulo}
          onChangeText={setTitulo}
        />

        <Text style={styles.label}>Rubro o Categoría</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ej: Electricidad" 
          placeholderTextColor="#A1A1AA"
          value={rubro}
          onChangeText={setRubro}
        />

        <Text style={styles.label}>Tu barrio o zona</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ej: Chauvín" 
          placeholderTextColor="#A1A1AA"
          value={ubicacion}
          onChangeText={setUbicacion}
        />

        <TouchableOpacity style={styles.button} onPress={manejarPublicacion}>
          <Text style={styles.buttonText}>Publicar en el Tablón</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#18181B',
  },
  content: {
    padding: 20,
    flex: 1,
  },
  description: {
    fontSize: 15,
    color: '#71717A',
    marginBottom: 25,
    lineHeight: 22,
  },
  errorText: {
    color: '#EF4444',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#18181B',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#F4F4F5',
    borderRadius: 8,
    padding: 16,
    fontSize: 15,
    color: '#18181B',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF6600',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
    boxShadow: '0px 4px 12px rgba(255, 102, 0, 0.3)',
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';

type Postulante = {
  postulacion_id: number;
  mensaje: string;
  profesional_nombre: string;
  verificado: boolean | number;
  categoria: string;
  anios_experiencia: number;
};

export default function PantallaVerPostulantes() {
  const router = useRouter();
  const params = useLocalSearchParams(); // Recibe el ID del aviso
  const solicitudId = params.id;

  const [postulantes, setPostulantes] = useState<Postulante[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarPostulantes = async () => {
      try {
        const respuesta = await fetch(`http://localhost:3000/api/solicitudes/${solicitudId}/postulantes`);
        const datos = await respuesta.json();
        
        if (respuesta.ok) {
          setPostulantes(datos);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setCargando(false);
      }
    };

    if (solicitudId) cargarPostulantes();
  }, [solicitudId]);

  const dibujarTarjeta = ({ item }: { item: Postulante }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.profesional_nombre.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.nombreFila}>
            <Text style={styles.nombre}>{item.profesional_nombre}</Text>
            {(item.verificado === true || item.verificado === 1) && (
              <Ionicons name="checkmark-circle" size={16} color="#FF6600" style={{ marginLeft: 4 }} />
            )}
          </View>
          <Text style={styles.rubro}>{item.categoria || 'Profesional'} · {item.anios_experiencia || 0} años exp.</Text>
        </View>
      </View>
      
      <View style={styles.mensajeBox}>
        <Text style={styles.mensaje}>{item.mensaje}</Text>
      </View>

      {/* ¡ACÁ ESTÁ EL BOTÓN CORREGIDO! */}
      <TouchableOpacity 
        style={styles.btnContactar} 
        onPress={() => router.push({ 
          pathname: '/chat', 
          params: { 
            postulacion_id: item.postulacion_id, 
            nombre_contacto: item.profesional_nombre 
          } 
        })}
      >
        <Ionicons name="chatbubbles-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={styles.btnTexto}>Contactar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { if (router.canGoBack()) router.back(); else router.replace('/perfil'); }} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#18181B" />
        </TouchableOpacity>
        <Text style={styles.title}>Postulantes</Text>
        <View style={{ width: 24 }} />
      </View>

      {cargando ? (
        <ActivityIndicator size="large" color="#FF6600" style={{ marginTop: 50 }} />
      ) : postulantes.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="mail-unread-outline" size={48} color="#D4D4D8" />
          <Text style={styles.emptyText}>Todavía no hay presupuestos para este aviso.</Text>
        </View>
      ) : (
        <FlatList
          data={postulantes}
          keyExtractor={(item) => item.postulacion_id.toString()}
          renderItem={dibujarTarjeta}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E4E4E7' },
  backButton: { padding: 5 },
  title: { fontSize: 18, fontWeight: '800', color: '#18181B' },
  list: { padding: 20 },
  empty: { flex: 1, alignItems: 'center', marginTop: 80, padding: 20 },
  emptyText: { textAlign: 'center', color: '#A1A1AA', marginTop: 15, fontSize: 16 },
  card: { backgroundColor: '#FFFFFF', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#E4E4E7' },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#18181B', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  nombreFila: { flexDirection: 'row', alignItems: 'center' },
  nombre: { fontSize: 16, fontWeight: '700', color: '#18181B' },
  rubro: { fontSize: 13, color: '#71717A', marginTop: 2 },
  mensajeBox: { backgroundColor: '#F4F4F5', padding: 12, borderRadius: 8, marginBottom: 15 },
  mensaje: { color: '#52525B', fontStyle: 'italic', fontSize: 14 },
  btnContactar: { flexDirection: 'row', backgroundColor: '#FF6600', paddingVertical: 12, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  btnTexto: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 }
});
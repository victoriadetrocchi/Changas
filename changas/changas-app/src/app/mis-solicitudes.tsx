import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Solicitud = {
  id: number;
  titulo: string;
  descripcion: string;
  estado: string;
};

export default function PantallaMisSolicitudes() {
  const router = useRouter();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarMisAvisos = async () => {
      try {
        const datosGuardados = await AsyncStorage.getItem('usuarioInfo');
        if (!datosGuardados) return;
        const usuarioLogueado = JSON.parse(datosGuardados);

        const respuesta = await fetch(`http://localhost:3000/api/mis-solicitudes/${usuarioLogueado.id}`);
        const datos = await respuesta.json();
        
        if (respuesta.ok) {
          setSolicitudes(datos);
        }
      } catch (error) {
        console.error("Error al cargar solicitudes:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarMisAvisos();
  }, []);

  const dibujarTarjeta = ({ item }: { item: Solicitud }) => (
    // ¡ACÁ ESTÁ EL FAMOSO PASO 3! 
    // Al tocar la tarjeta de tu aviso, te lleva a la pantalla de postulantes pasándole el ID
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push({ pathname: '/ver-postulantes', params: { id: item.id } })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.titulo}>{item.titulo}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.estado || 'Activo'}</Text>
        </View>
      </View>
      <Text style={styles.descripcion} numberOfLines={2}>{item.descripcion}</Text>
      
      <View style={styles.footerRow}>
        <Text style={styles.verPostulantesText}>Ver postulantes recibidos</Text>
        <Ionicons name="arrow-forward" size={16} color="#FF6600" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { if (router.canGoBack()) router.back(); else router.replace('/perfil'); }} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#18181B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Avisos Publicados</Text>
        <View style={{ width: 24 }} />
      </View>

      {cargando ? (
        <ActivityIndicator size="large" color="#FF6600" style={{ marginTop: 50 }} />
      ) : solicitudes.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="document-text-outline" size={48} color="#D4D4D8" />
          <Text style={styles.emptyText}>Todavía no publicaste ningún aviso.</Text>
        </View>
      ) : (
        <FlatList
          data={solicitudes}
          keyExtractor={(item) => item.id.toString()}
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
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#18181B' },
  list: { padding: 20 },
  empty: { flex: 1, alignItems: 'center', marginTop: 80, padding: 20 },
  emptyText: { textAlign: 'center', color: '#A1A1AA', marginTop: 15, fontSize: 16 },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#E4E4E7' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  titulo: { fontSize: 16, fontWeight: '700', color: '#18181B', flex: 1, marginRight: 10 },
  badge: { backgroundColor: '#FFF7ED', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#FFEDD5' },
  badgeText: { fontSize: 12, color: '#EA580C', fontWeight: '600' },
  descripcion: { fontSize: 14, color: '#71717A', marginBottom: 15 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F4F4F5', paddingTop: 12 },
  verPostulantesText: { fontSize: 14, color: '#FF6600', fontWeight: '600' }
});
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';

type Profesional = {
  usuario_id: string;
  nombre: string;
  verificado: boolean | number;
  categoria: string;
  descripcion: string;
  radio_cobertura_km: number;
  anios_experiencia: number;
  zona_base: string;
};

export default function PantallaBuscar() {
  const router = useRouter();
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [cargando, setCargando] = useState(true);

  // Cargamos los datos apenas se abre la pestaña
  useEffect(() => {
    const cargarDirectorio = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/api/profesionales');
        const datos = await respuesta.json();
        
        if (respuesta.ok) {
          setProfesionales(datos);
        }
      } catch (error) {
        console.error("Error al cargar el directorio:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDirectorio();
  }, []);

  const dibujarTarjeta = ({ item }: { item: Profesional }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.nombre.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.info}>
          <View style={styles.nombreFila}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            {/* Si está verificado, le ponemos el tilde azul/naranja */}
            {(item.verificado === true || item.verificado === 1) && (
              <Ionicons name="checkmark-circle" size={16} color="#FF6600" style={{ marginLeft: 4 }} />
            )}
          </View>
          <Text style={styles.categoria}>{item.categoria}</Text>
        </View>
      </View>

      <Text style={styles.descripcion} numberOfLines={2}>
        {item.descripcion}
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statTag}>
          <Ionicons name="briefcase-outline" size={14} color="#71717A" />
          <Text style={styles.statText}>{item.anios_experiencia} años exp.</Text>
        </View>
        <View style={styles.statTag}>
          <Ionicons name="location-outline" size={14} color="#71717A" />
          <Text style={styles.statText}>
            {item.zona_base ? `${item.zona_base} · ` : ''}Cobertura a {item.radio_cobertura_km} km
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.btnVerPerfil}>
        <Text style={styles.btnTexto}>Ver Perfil Público</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Directorio</Text>
        <Text style={styles.subtitle}>Encontrá a los mejores profesionales en tu zona.</Text>
      </View>

      {cargando ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#FF6600" />
        </View>
      ) : profesionales.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="search-outline" size={48} color="#D4D4D8" />
          <Text style={styles.emptyText}>Todavía no hay profesionales registrados.</Text>
        </View>
      ) : (
        <FlatList
          data={profesionales}
          keyExtractor={(item) => item.usuario_id}
          renderItem={dibujarTarjeta}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F5' },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E4E4E7' },
  title: { fontSize: 28, fontWeight: '900', color: '#18181B' },
  subtitle: { fontSize: 15, color: '#71717A', marginTop: 4 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { textAlign: 'center', color: '#A1A1AA', marginTop: 15, fontSize: 16 },
  listContent: { padding: 20, paddingBottom: 100 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: '#E4E4E7', boxShadow: '0px 2px 8px rgba(0,0,0,0.04)', elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#18181B', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  info: { flex: 1 },
  nombreFila: { flexDirection: 'row', alignItems: 'center' },
  nombre: { fontSize: 18, fontWeight: '800', color: '#18181B' },
  categoria: { fontSize: 14, color: '#FF6600', fontWeight: '600', marginTop: 2 },
  descripcion: { fontSize: 14, color: '#52525B', lineHeight: 20, marginBottom: 15 },
  statsRow: { flexDirection: 'row', marginBottom: 20 },
  statTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F4F4F5', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, marginRight: 10 },
  statText: { fontSize: 12, color: '#52525B', marginLeft: 4, fontWeight: '500' },
  btnVerPerfil: { width: '100%', backgroundColor: '#F4F4F5', paddingVertical: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#E4E4E7' },
  btnTexto: { fontSize: 14, fontWeight: '700', color: '#18181B' }
});
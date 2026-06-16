import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from "react-native";
import { useRouter, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";

type Trabajo = {
  id: string;
  titulo: string;
  ubicacion: string;
  tiempo: string;
  rubro: string;
};

export default function PantallaInicio() {
  const router = useRouter();
  
  // Estados para manejar los datos reales
  const [trabajos, setTrabajos] = useState<Trabajo[]>([]);
  const [cargando, setCargando] = useState(true);

  // Esta función va a buscar los trabajos a tu servidor
  const obtenerTrabajos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/trabajos');
      const datos = await respuesta.json();
      
      if (respuesta.ok) {
        setTrabajos(datos);
      }
    } catch (error) {
      console.error("Error cargando los trabajos:", error);
    } finally {
      setCargando(false);
    }
  };

  // Se ejecuta automáticamente al abrir la pantalla
  useEffect(() => {
    obtenerTrabajos();
  }, []);

  const dibujarTarjeta = ({ item }: { item: Trabajo }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.titulo}</Text>
      <Text style={styles.cardSub}>
        {item.ubicacion} · {item.tiempo}
      </Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.rubro}</Text>
      </View>
      <Link href={{ pathname: "/postular", params: { id: item.id, titulo: item.titulo } }} asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Postularme</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            Changas<Text style={styles.acentoNaranja}>.</Text>
          </Text>
          <Text style={styles.headerSub}>📍 Mar del Plata</Text>
        </View>

        <Link href="/publicar" asChild>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </Link>
      </View>

      {/* Si está cargando muestra una ruedita, sino muestra la lista real */}
      {cargando ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#FF6600" />
        </View>
      ) : (
        <FlatList
          data={trabajos}
          keyExtractor={(item) => item.id}
          renderItem={dibujarTarjeta}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F4F5" },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E7",
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  headerTitle: { color: "#18181B", fontSize: 28, fontWeight: "900", letterSpacing: -0.5 },
  acentoNaranja: { color: "#FF6600" },
  headerSub: { color: "#71717A", fontSize: 14, marginTop: 2, fontWeight: "500" },
  addButton: {
    backgroundColor: '#18181B', width: 44, height: 44, borderRadius: 22, 
    justifyContent: 'center', alignItems: 'center', marginTop: 15,
  },
  card: {
    backgroundColor: "#FFFFFF", marginHorizontal: 15, marginTop: 15, padding: 15,
    borderRadius: 12, boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)", elevation: 2,
    borderWidth: 1, borderColor: "#F4F4F5",
  },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#18181B" },
  cardSub: { fontSize: 13, color: "#71717A", marginTop: 4, marginBottom: 16 },
  badge: {
    backgroundColor: "#F4F4F5", alignSelf: "flex-start", paddingVertical: 5,
    paddingHorizontal: 10, borderRadius: 6, marginBottom: 20,
  },
  badgeText: { color: "#52525B", fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  button: { backgroundColor: "#FF6600", paddingVertical: 14, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold" },
});
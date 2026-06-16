import { Tabs } from "expo-router";
// Expo ya trae librerías de íconos instaladas por defecto, importamos Ionicons
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Seguimos ocultando la cabecera superior
        tabBarActiveTintColor: "#FF6600", // Tu naranja para la pestaña activa
        tabBarInactiveTintColor: "#A1A1AA", // Gris neutro para las inactivas
        
        // Ajustamos la caja de la barra
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E4E4E7",
          height: 75, // <-- Subimos de 60 a 65
          paddingBottom: 5,
          paddingTop: 5,
        },
        
        // <-- ¡ESTO ES LO QUE FALTABA! Ajustamos el texto:
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 5, // Esto empuja el texto un poquito para arriba
        }
      }}
    >
      {/* Pestaña 1: El Tablón (apunta a tu archivo index.tsx) */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Tablón",
          tabBarIcon: ({ color }) => (
            <Ionicons name="clipboard-outline" size={24} color={color} />
          ),
        }}
      />

      {/* Pestaña 2: Directorio */}
      <Tabs.Screen
        name="directorio"
        options={{
          title: "Buscar",
          tabBarIcon: ({ color }) => (
            <Ionicons name="search-outline" size={24} color={color} />
          ),
        }}
      />

      {/* Pestaña 3: Perfil */}
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
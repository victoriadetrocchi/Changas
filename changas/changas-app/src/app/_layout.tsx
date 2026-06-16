import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    // Stack apila pantallas una sobre otra, ideal para separar el Login del resto de la app
    <Stack screenOptions={{ headerShown: false }}>
      {/* Declaramos el grupo de pestañas */}
      <Stack.Screen name="(tabs)" />
      {/* Declaramos la pantalla de login */}
      <Stack.Screen name="login" />
    </Stack>
  );
}

import { Redirect } from "expo-router";

export default function PantallaRaiz() {
  // Apenas la app arranca, esto patea al usuario directamente a la ruta /login
  return <Redirect href="/login" />;
}

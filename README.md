# App de Servicios - Conectora del Hogar

Aplicación móvil (MVP) de doble vía que conecta de manera directa a usuarios con necesidades de servicios en el hogar con prestadores independientes locales, basando la confianza en un sistema comunitario de reseñas[cite: 2].

## 🚀 Características Principales

*   **Tablón de anuncios geolocalizado:** Publicación de problemas y necesidades detectando la ubicación del usuario[cite: 2].
*   **Directorio de prestadores:** Búsqueda filtrable por rubro y radio de cercanía en kilómetros[cite: 2].
*   **Mensajería interna (Chat):** Comunicación en tiempo real para negociaciones seguras sin exponer datos de contacto inicialmente[cite: 2].
*   **Motor de reputación:** Sistema de calificaciones (1 a 5 estrellas) y reseñas obligatorias post-servicio[cite: 2].
*   **Validación de identidad:** Mitigación de riesgos mediante validación básica con DNI[cite: 2].

## 🛠️ Stack Tecnológico

*   **Frontend:** React Native[cite: 2].
*   **Backend:** Node.js con Express[cite: 2].
*   **Base de Datos:** MySQL (implementando *Spatial Data Types* para cálculos de geolocalización nativos)[cite: 2].
*   **Comunicación en Tiempo Real:** WebSockets[cite: 2].

## 🏗️ Arquitectura y Modelo de Datos

El proyecto utiliza una arquitectura Cliente-Servidor[cite: 2]:
*   **Client-Side:** Aplicación nativa que maneja la UI, interacciones, geolocalización y consumo de API[cite: 2].
*   **Server-Side:** Exposición de endpoints REST para operaciones CRUD, autenticación mediante JWT y WebSockets para las salas de chat[cite: 2].
*   **Database:** Modelo relacional que vincula usuarios, servicios, publicaciones, postulaciones, salas de chat y reseñas[cite: 2].

## ⚙️ Instalación y Ejecución

1. Clonar el repositorio:
   git clone [https://github.com/victoriadetrocchi/Changas.git](https://github.com/victoriadetrocchi/Changas.git)
   
3. Instalar dependencias del servidor:
   
   cd backend
   npm install
   
4. Instalar dependencias de la aplicación móvil:
   
   cd frontend
   npm install
   
5. Configurar las variables de entorno (.env) con las credenciales de MySQL y secretos de JWT.

6. Iniciar el servidor de desarrollo:

   npm run dev

7. Iniciar la aplicación en el emulador o dispositivo físico:

   npx react-native run-android # o run-ios

# Home Services Connector App

Two-way mobile application (MVP) that directly connects users needing home services with local independent providers, basing trust on a community-driven review system.

## Key Features

*   **Geolocated job board:** Publishing of problems and needs by detecting the user's location.
*   **Provider directory:** Filterable search by trade category and proximity radius in kilometers.
*   **Internal messaging (Chat):** Real-time communication for secure negotiations without initially exposing contact details.
*   **Reputation engine:** Rating system (1 to 5 stars) and mandatory post-service reviews.
*   **Identity validation:** Risk mitigation through basic ID validation.

## Tech Stack

*   **Frontend:** React Native.
*   **Backend:** Node.js with Express.
*   **Database:** MySQL (implementing *Spatial Data Types* for native geolocation calculations).
*   **Real-Time Communication:** WebSockets.

## Architecture and Data Model

The project utilizes a Client-Server architecture:
*   **Client-Side:** Native application handling UI, interactions, geolocation, and API consumption.
*   **Server-Side:** REST endpoints for CRUD operations, JWT authentication, and WebSockets for chat rooms.
*   **Database:** Relational model linking users, services, publications, applications, chat rooms, and reviews.

## Installation and Setup

1. Clone the repository:
   git clone [https://github.com/victoriadetrocchi/Changas.git](https://github.com/victoriadetrocchi/Changas.git)

2. Install server dependencies:

   cd backend
   npm install

3. Install mobile app dependencies:

   cd frontend
   npm install

4. Configure environment variables (.env) with MySQL credentials and JWT secrets.

5. Start the development server:

   npm run dev

6.Run the application on an emulator or physical device:

   npx react-native run-android # or run-ios

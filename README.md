# Home Services Connector App

Two-way mobile application (MVP) that directly connects users needing home services with local independent providers, basing trust on a community-driven review system[cite: 2].

## Key Features

*   **Geolocated job board:** Publishing of problems and needs by detecting the user's location[cite: 2].
*   **Provider directory:** Filterable search by trade category and proximity radius in kilometers[cite: 2].
*   **Internal messaging (Chat):** Real-time communication for secure negotiations without initially exposing contact details[cite: 2].
*   **Reputation engine:** Rating system (1 to 5 stars) and mandatory post-service reviews[cite: 2].
*   **Identity validation:** Risk mitigation through basic ID validation[cite: 2].

## Tech Stack

*   **Frontend:** React Native[cite: 2].
*   **Backend:** Node.js with Express[cite: 2].
*   **Database:** MySQL (implementing *Spatial Data Types* for native geolocation calculations)[cite: 2].
*   **Real-Time Communication:** WebSockets[cite: 2].

## Architecture and Data Model

The project utilizes a Client-Server architecture[cite: 2]:
*   **Client-Side:** Native application handling UI, interactions, geolocation, and API consumption[cite: 2].
*   **Server-Side:** REST endpoints for CRUD operations, JWT authentication, and WebSockets for chat rooms[cite: 2].
*   **Database:** Relational model linking users, services, publications, applications, chat rooms, and reviews[cite: 2].

## Installation and Setup

1. Clone the repository:
   git clone [https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git)
Install server dependencies:

   cd backend
   npm install
Install mobile app dependencies:

   cd frontend
   npm install
Configure environment variables (.env) with MySQL credentials and JWT secrets.

Start the development server:

Bash
   npm run dev
Run the application on an emulator or physical device:

Bash
   npx react-native run-android # or run-ios

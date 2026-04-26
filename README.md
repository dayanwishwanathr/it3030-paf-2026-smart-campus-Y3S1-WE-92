# SLIIT Orbit - Smart Campus Operations Hub

<img width="210" height="55" alt="Orbit Logo" src="https://github.com/user-attachments/assets/bbdc4ab4-1f85-442c-aa04-cb38c9325efd" />

> A campus management platform built for SLIIT - handles resource bookings, issue tickets, and user management all in one place.

---

## What is this?

Orbit is a full-stack web app we built as part of the IT3030 Programming and Frameworks module (2026, Y3S1, Group WE-92). The idea was simple: SLIIT has a lot of shared campus resources - labs, rooms, equipment, and no good way to manage who's booking what or report when something's broken. Orbit tries to fix that.

Students can browse available resources and make bookings. If something breaks, they can raise a support ticket. Technicians pick up those tickets and handle them. Managers oversee the resource catalogue and approve or reject bookings. Admins handle user accounts and roles. It's not a huge system, but it covers the real workflows pretty well.

---

## Tech Stack

**Backend**
- Java 21 + Spring Boot 3.4.5
- Spring Security with JWT (JJWT 0.12.6) + Google OAuth2
- MongoDB (via Spring Data MongoDB)
- Lombok, Bean Validation

**Frontend**
- React 19 + Vite 8
- React Router v7
- Tailwind CSS v4
- Axios

---

## Project Structure

```
/
├── orbit-backend/      # Spring Boot API
│   └── src/main/java/com/sliit/orbit_backend/
│       ├── config/         # SecurityConfig, CORS, etc.
│       ├── controller/     # REST controllers
│       ├── model/          # MongoDB documents + enums
│       ├── repository/     # Spring Data repos
│       ├── security/       # JWT filter, OAuth2 handler
│       └── service/        # Business logic
│
└── orbit-frontend/     # React SPA
    └── src/
        ├── api/            # Axios service wrappers
        ├── components/     # Shared UI components
        ├── context/        # Auth context
        └── pages/          # Feature pages (admin, bookings, tickets, etc.)
```

---

## Getting Started

### Prerequisites

- Java 21
- Node.js 18+
- MongoDB running locally (default port `27017`)
- A Google OAuth2 client ID + secret (for Google Sign-In)

### Running the Backend

```bash
cd orbit-backend
./mvnw spring-boot:run
```

The API starts on `http://localhost:8080`. Make sure your MongoDB is running before this.

You'll need an `application.properties` (or `.yml`) with at least:

```properties
spring.data.mongodb.uri=mongodb://localhost:27017/orbit
spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET
app.jwt.secret=YOUR_JWT_SECRET
app.cors.allowed-origins=http://localhost:5173
```

### Running the Frontend

```bash
cd orbit-frontend
npm install
npm run dev
```

Opens at `http://localhost:5173`.

---

## Features

**Resource Catalogue**
- Browse campus resources
- Managers can add, edit, or remove resources
- QR code preview for each resource

**Bookings**
- Students book resources for specific time slots
- Check availability before booking
- Managers approve or reject pending requests
- Users can view and manage their own bookings

**Support Tickets**
- Report issues with campus resources
- Attach files to tickets
- Technicians update status and add resolution notes
- Full comment thread on each ticket

**Admin Panel**
- View and manage all user accounts
- Assign roles, filter by type, export user list as PDF
- Dashboard with system overview

**Notifications**
- In-app notifications for booking status changes, ticket updates, etc.

---

## User Roles

| Role | What they can do |
|---|---|
| `USER` | Browse resources, make bookings, raise tickets |
| `MANAGER` | Manage resource catalogue, approve/reject bookings |
| `TECHNICIAN` | View and resolve assigned support tickets |
| `ADMIN` | Full user management, role assignment, system oversight |

---

## Auth

Login works two ways - email/password (JWT-based) or Google Sign-In (OAuth2). After either flow, the frontend gets a JWT which it attaches to every API request. Sessions aren't stored server-side; it's stateless except for the OAuth2 state cookie during the login redirect.

---

## Notes

- The `mongodb_data/` folder in the root is for local dev only - it's not committed
- Backend CORS is configured to accept any origin in dev (`allowedOriginPatterns = *`), tighten this before any real deployment
- There's a seed/init package (`com.sliit.orbit_backend.init`) that creates a default admin account on first run

---

*IT3030 – Programming and Frameworks | SLIIT 2026 | Group WE-92*

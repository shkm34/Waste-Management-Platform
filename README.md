♻️ Waste Management Marketplace

MERN + Socket.IO Real-Time Platform

A full-stack waste management marketplace where customers post waste pickup requests, dealers claim and process them, and drivers handle logistics — all powered by real-time updates using Socket.IO.

Built with MongoDB, Express, React, Node.js, and TypeScript.

📑 Table of Contents

Overview

Core Features

Architecture

Tech Stack

Folder Structure

Backend Setup

Frontend Setup

Environment Variables

Authentication & Roles

Real-Time Features

API Overview

Socket Events

Development Workflow

Testing

Potential Improvements

License

1. Overview

This project is a real-time waste management platform connecting three types of users:

👤 Customers

Create waste listings (plastic, metal, e-waste etc.)

Schedule pickups

Track request status

🏭 Dealers

Browse marketplace listings

Claim waste pickup jobs

Coordinate logistics

🚚 Drivers

Handle pickups and deliveries

Update job progress in real time

The platform combines REST APIs for reliability and Socket.IO for real-time updates, ensuring both robustness and live responsiveness.

2. Core Features
2.1 User Accounts & Roles

Authentication is handled using JWT tokens.

Supported roles:

customer

dealer

driver

Role-based access control is enforced for:

REST APIs

Socket events

Marketplace access

Example: only dealers can join the dealer marketplace room.

2.2 Waste / Garbage Management
Customers can

Create waste listings

Specify type, weight, location, pickup schedule

Track request status

Waste lifecycle:

AVAILABLE → CLAIMED → ASSIGNED → READY → PICKED_UP → DELIVERED
Dealers can

Browse available waste listings

Claim jobs

See listings update in real time

Drivers can

View assigned jobs

Update pickup and delivery status

2.3 Real-Time Features
Dealer Marketplace Room

Dealers receive live updates:

garbage:created

garbage:claimed

Garbage Specific Room

Participants join:

garbage-{garbageId}

They receive status updates for that specific listing.

User Notification Room

Each user automatically joins:

user-{userId}

Used for notifications like:

"Your waste was claimed"

"Driver assigned"

"Pickup completed"

2.4 Frontend UX

The frontend is a React + TypeScript Single Page Application.

Features include:

Global Socket.IO connection via React Context

Custom hooks for socket management

Toast notifications

Real-time marketplace updates

Socket connection indicators



3. Architecture

The system follows a MERN architecture enhanced with WebSockets.
```
Client (React + TypeScript)
      |
      |------ REST API ------> Express Server
      |                          |
      |<-------------------------|
      |
      |------ WebSocket --------> Socket.IO
                                 |
                                 +---- MongoDB

 ```                               
3.1 Backend

Express provides REST APIs such as:

/api/auth
/api/garbage
/api/transactions

Socket.IO is attached to the same HTTP server.

Features include:

JWT-based socket authentication

Role-based socket access

Room-based messaging

Rooms used:

dealer-marketplace
garbage-{id}
user-{userId}

Controllers handle:

Request validation

Database operations

Emitting socket events after successful operations

3.2 Frontend

Frontend architecture uses:

React

TypeScript

Socket.IO client

Socket management is centralized using:

socketService

Singleton wrapper for socket.io-client.

SocketProvider

React Context exposing:

socket
connection status
Custom Hooks
useSocket
useSocketEvent
useSocketConnection
useDealerMarketplace

REST APIs are used for initial data loading, while Socket.IO handles real-time updates.

4. Tech Stack
Backend

Node.js

Express

MongoDB

Mongoose

Socket.IO

TypeScript

JWT Authentication

Frontend

React

TypeScript

Vite / CRA

Socket.IO Client

CSS / Tailwind

5. Folder Structure
```
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── socket
│   │   ├── server.ts
│   │   └── app.ts
│   └── package.json
│
└── frontend
    ├── src
    │   ├── config
    │   ├── context
    │   ├── hooks
    │   ├── components
    │   ├── pages
    │   ├── styles
    │   ├── types
    │   ├── App.tsx
    │   └── main.tsx
    └── package.json
```
7. Backend Setup
Prerequisites

Node.js LTS

MongoDB (local or Atlas)

npm or yarn

Install Dependencies
cd backend
npm install
Environment Variables

Create .env inside backend.

NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

MONGO_URI=mongodb://localhost:27017/waste-management

JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
Run Backend
npm run dev

Expected output:

🚀 Waste Management Platform - Backend
Environment: development
Server: http://localhost:5000
Health: http://localhost:5000/api/health
7. Frontend Setup
Install Dependencies
cd frontend
npm install
Environment Variables

Create .env in frontend.

VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000

VITE_SOCKET_DEBUG=true
VITE_SOCKET_AUTO_CONNECT=false
Run Frontend
npm run dev

Default:

http://localhost:5173
8. Environment Variables
Backend
Variable	Description
NODE_ENV	development / production
PORT	Backend port
CLIENT_URL	Frontend URL for CORS
MONGO_URI	MongoDB connection string
JWT_SECRET	JWT signing key
JWT_EXPIRES_IN	Token expiry
Frontend
Variable	Description
VITE_API_URL	REST API base URL
VITE_SOCKET_URL	Socket server URL
VITE_SOCKET_DEBUG	Debug logs
VITE_SOCKET_AUTO_CONNECT	Auto connect socket
9. Authentication & Roles

Authentication follows the JWT token pattern.

Register
POST /api/auth/register

Example:

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9999999999",
  "password": "password123",
  "role": "dealer",
  "location": "City, State"
}
Login
POST /api/auth/login

Response:

{
  "token": "JWT_TOKEN",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "role": "dealer"
  }
}

Token is used for:

Authorization: Bearer <token>

And Socket.IO authentication:

auth: { token }
10. Real-Time Features

Connection flow:

1️⃣ User logs in
2️⃣ Frontend connects socket with JWT
3️⃣ Server authenticates token
4️⃣ User joins personal room

user-{userId}

Rooms used:

dealer-marketplace
garbage-{id}
user-{userId}
11. API Overview
Health
GET /api/health
Auth
POST /api/auth/register
POST /api/auth/login
Garbage
Marketplace
GET /api/garbage/marketplace

Dealer only.

Create Waste
POST /api/garbage

Customer only.

Claim Waste
POST /api/garbage/:id/claim

Dealer only.

12. Socket Events
Client → Server
dealer:joinMarketplace
dealer:leaveMarketplace
garbage:subscribe
garbage:unsubscribe
Server → Client
dealer:joinedMarketplace
dealer:leftMarketplace

garbage:created
garbage:claimed
garbage:statusChanged

notification:new
error
13. Development Workflow

1️⃣ Start MongoDB
2️⃣ Start backend

npm run dev

3️⃣ Start frontend

npm run dev

4️⃣ Login as dealer and customer in separate browsers.

5️⃣ Create waste and observe real-time marketplace updates.

14. Testing
Manual Testing

Tools:

Postman

Thunder Client

Browser DevTools

Inspect WebSocket frames:

Network → WS
Automated Testing (Optional)

Possible additions:

Jest

Supertest

Artillery

k6

15. Potential Improvements

Possible future enhancements:

Driver mobile app with GPS tracking

Marketplace filters (distance, weight, type)

Admin dashboard

Persistent notifications

Rate limiting

CI/CD pipelines

16. License

This project is intended for learning and portfolio purposes.

You are free to modify, adapt, and reuse the code in your own projects.

For production usage, ensure:

security hardening

validation

proper deployment practices

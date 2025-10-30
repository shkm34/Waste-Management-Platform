Waste Management Platform

A three-role marketplace platform connecting waste generators (Customers), processing facilities (Dealers), and transport logistics (Drivers).

This project aims to streamline the waste collection process, creating a simple, efficient marketplace for waste, and incentivizing recycling and proper disposal through a digital credits system.

Key Features

Secure Authentication: JWT-based auth for all users, with secure password hashing (bcrypt).

Role-Based Access Control: The application provides a unique UI and set of permissions for each role:

Customer Role:

Create and schedule new waste pickup requests.

Track the real-time status of their pickups (e.g., "Available," "Claimed," "Picked Up").

Receive wallet credits upon successful delivery confirmation.

Dealer Role:

Browse a live marketplace of available waste pickups, filtered by type (e.g., "Plastic," "Organic," "Electronic").

Claim waste pickups that match their facility's capabilities.

Confirm delivery to close the loop and trigger credit transfer.

Driver Role:

View a dashboard of assigned pickup and delivery jobs.

Update job status in real-time.

View customer and dealer location details for logistics.

Tech Stack

This project is a full-stack MERN application built with modern, type-safe tools.

Frontend:

React (with Vite): A high-performance, modern React build tool.

TypeScript: For robust, type-safe code.

Tailwind CSS: For utility-first styling and component design.

Axios: For promise-based API communication.

React Hook Form: For efficient and performant form validation.

Backend:

Node.js: JavaScript runtime environment.

Express.js: Minimalist web framework for building the REST API.

TypeScript: For type safety on the server.

Database:

MongoDB: NoSQL database for flexible data storage.

Mongoose: Object Data Modeling (ODM) library for MongoDB.

Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing.

Prerequisites

You will need the following tools installed on your machine:

Node.js (v18.x or later)

npm (Node Package Manager)

MongoDB (or a MongoDB Atlas cloud account)

Local Setup

Clone the repository:

git clone [https://github.com/your-username/your-repo-link.git](https://github.com/your-username/your-repo-link.git)
cd your-repo-link


Setup the Backend (Server):

# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create a .env file from the example
cp .env.example .env

# Add your environment variables to the .env file (see below)

# Start the development server
npm run dev


Your backend server will be running on http://localhost:5000 (or your specified port).

Setup the Frontend (Client):

# Navigate to the client directory from the root
cd client

# Install dependencies
npm install

# Create a .env file from the example
cp .env.example .env

# Add your environment variables (see below)

# Start the React development server
npm run dev


Your React app will be available at http://localhost:5173 (or the next available port).

Environment Variables

You must create .env files in both the /server and /client directories.

Server (server/.env):

# Port for the Express server
PORT=5000

# Your MongoDB connection string
MONGO_URI="mongodb://localhost:27017/waste_management"

# JWT secret for signing tokens
JWT_SECRET="your_super_secret_jwt_key"
JWT_EXPIRE="1d"


Client (client/.env):

# URL of the backend API
VITE_API_URL="http://localhost:5000/api"


Project Status

🚧 In Development - MVP Phase

This project is currently in active development. The core features for the MVP (Minimum Viable Product) are being built.

Future Roadmap

[ ] Implement a live chat system for communication between Drivers and Dealers.

[ ] Integrate a mapping service for driver route optimization.

[ ] Build a payment gateway for wallet credit cash-out.

[ ] Develop a comprehensive Admin Dashboard for platform management.

This README was generated and enhanced from a user-provided template.



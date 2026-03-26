# Smart Complaint System

## Description

A full-stack web application for managing user complaints. Users can register, login, submit complaints, and view their complaints on a dashboard.

## Features

- User authentication (register, login) with JWT
- Complaint submission and management
- User dashboard
- CORS configuration for frontend-backend communication

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.5.11
- Spring Data JPA
- Spring Security with JWT
- H2 Database (for development)
- Maven

### Frontend
- React 19
- Vite
- Axios for API calls
- React Router DOM

## Prerequisites

- Java 17
- Node.js (latest LTS)
- Maven

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Smart-Complaint-System
   ```

2. Backend setup:
   ```bash
   cd backend
   mvn clean install
   ```

3. Frontend setup:
   ```bash
   cd ../frontend
   npm install
   ```

## Running the Application

1. Start the backend:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   The backend will run on http://localhost:8081

2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on http://localhost:5173 (default Vite port)

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Users
- GET /api/users - Get all users

### Complaints
- GET /api/complaints - Get user's complaints
- POST /api/complaints - Submit a new complaint
- PUT /api/complaints/{id} - Update complaint
- DELETE /api/complaints/{id} - Delete complaint

## Database

The application uses H2 in-memory database for development. Access the H2 console at http://localhost:8081/h2-console

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
# Daily To-Do - Backend

This is the backend repository for the **Daily To-Do** application. It provides APIs for user management and task management, allowing users to register, manage their profiles, and organize their tasks efficiently.

---

## Table of Contents

1. [Features](#features)
2. [API Endpoints](#api-endpoints)
3. [Dependencies](#dependencies)
4. [Setup Instructions](#setup-instructions)
5. [Environment Variables](#environment-variables)
6. [Running the Server](#running-the-server)

---

## Features

- **User Management**:
  - Register a new user.
  - Retrieve all users.
  - Update user profile.
  - Get user details by email.

- **Task Management**:
  - Create a new task.
  - Get tasks for a specific user.
  - Update task category.
  - Delete a task.
  - Get today's tasks for a user.
  - Get upcoming tasks for a user.
  - Update task details.

---

## API Endpoints

### User Management

| Method | Endpoint                  | Description                     |
|--------|---------------------------|---------------------------------|
| POST   | `/users`                  | Register a new user.            |
| GET    | `/users`                  | Get all users.                  |
| PUT    | `/users/profile/:id`      | Update user profile.            |
| GET    | `/user?email=<email>`     | Get user details by email.      |

### Task Management

| Method | Endpoint                          | Description                             |
|--------|-----------------------------------|-----------------------------------------|
| POST   | `/tasks`                          | Create a new task.                      |
| GET    | `/tasks?email=<email>`            | Get tasks for a specific user.          |
| PUT    | `/tasks/:id`                      | Update task category.                   |
| DELETE | `/tasks/:id`                      | Delete a task.                          |
| GET    | `/my-tasks/today/:email`          | Get today's tasks for a user.           |
| GET    | `/my-tasks/upcoming/:email`       | Get upcoming tasks for a user.          |
| PATCH  | `/my-task/update/:id`             | Update task details.                    |

---

## Dependencies

The project uses the following dependencies:

- `cors`: Enable CORS for API requests.
- `dotenv`: Load environment variables.
- `express`: Web framework for Node.js.
- `jsonwebtoken`: Authentication with JWT.
- `mongodb`: MongoDB client for Node.js.

## Live Link
https://daily-to-do-server.vercel.app/

You can install all dependencies using:

```bash
npm install

git clone https://github.com/Yead191/to-do-app-server
cd to-do-app-server




# LegalWise

LegalWise is a comprehensive platform designed to streamline legal processes, facilitate community discussions, and provide AI-powered chatbot assistance for legal queries. The platform includes features like user authentication, community posts, conversations, and real-time chat functionality.

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Folder Structure](#folder-structure)
- [API Documentation](#api-documentation)
  - [User Routes](#user-routes)
  - [Conversation Routes](#conversation-routes)
  - [Message Routes](#message-routes)
  - [Post Routes](#post-routes)
  - [Comment Routes](#comment-routes)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

LegalWise is a platform that combines community-driven discussions with AI-powered chatbot assistance to address legal queries. It allows users to create and participate in conversations, post questions in the community, and receive AI-generated responses to their queries.

---

## Features

- **User Authentication**: Secure user registration, login, and logout.
- **Community Posts**: Create, browse, and interact with community posts.
- **Conversations**: Start and manage conversations with other users.
- **AI Chatbot**: Get AI-powered responses to legal queries.
- **Dark Mode**: Toggle between light and dark themes for better accessibility.

---

## Technologies Used

- **Frontend**: React, Redux, TailwindCSS
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: Google Generative AI (Gemini API)
- **State Management**: Redux Toolkit
- **Styling**: TailwindCSS
- **API Testing**: Postman

---

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Redis (for session management)

### Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/vishwanathhatti/LegalWise.git
    ```
2. Navigate to the project directory:
    ```bash
    cd LegalWise
    ```
3. Install dependencies for both frontend and backend:
    ```bash
    cd frontend && npm install
    cd ../backend && npm install
    ```
4. Set up environment variables:
    - Create a `.env` file in the `backend` folder with the following:
        ```
        PORT=5000
        MONGO_URI=your_mongodb_connection_string
        SECRET_KEY=your_jwt_secret
        GEMINI_API_KEY=your_google_generative_ai_key
        REDIS_URL=your_redis_connection_string
        ```
5. Start the development servers:
    - Backend:
        ```bash
        cd backend && npm run dev
        ```
    - Frontend:
        ```bash
        cd frontend && npm run dev
        ```

---

## Folder Structure

```
LegalWise/
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── App.jsx
│   └── vite.config.js
└── Readme.md
```

---

## API Documentation

### User Routes

#### **Register User**
- **Endpoint**: `POST /api/user/register`
- **Description**: Registers a new user.
- **Request Body**:
    ```json
    {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phoneNumber": "1234567890",
        "password": "password123"
    }
    ```
- **Response**:
    - **200**: User registered successfully.
    - **400**: Missing fields or user already exists.
    - **500**: Internal server error.

#### **Login**
- **Endpoint**: `POST /api/user/login`
- **Description**: Logs in a user.
- **Request Body**:
    ```json
    {
        "email": "john.doe@example.com",
        "password": "password123"
    }
    ```
- **Response**:
    - **200**: Login successful.
    - **400**: Invalid credentials or missing fields.
    - **500**: Internal server error.

---

### Conversation Routes

#### **Create Conversation**
- **Endpoint**: `POST /api/conversation/create`
- **Description**: Creates a new conversation.
- **Request Body**:
    ```json
    {
        "title": "Legal Discussion"
    }
    ```
- **Headers**:
    - `Authorization`: Bearer token
- **Response**:
    - **200**: Conversation created successfully.
    - **400**: Missing fields or userId.
    - **500**: Internal server error.

#### **Get User Conversations**
- **Endpoint**: `GET /api/conversation/get`
- **Description**: Retrieves all conversations for a user.
- **Headers**:
    - `Authorization`: Bearer token
- **Response**:
    - **200**: List of conversations.
    - **400**: Unable to fetch userId.
    - **500**: Internal server error.

---

### Message Routes

#### **Add Message**
- **Endpoint**: `POST /api/conversation/:id`
- **Description**: Adds a message to a conversation.
- **Request Body**:
    ```json
    {
        "content": "What are the legal rights for employees in India?"
    }
    ```
- **Headers**:
    - `Authorization`: Bearer token
- **Response**:
    - **200**: Message added successfully.
    - **400**: Missing fields or unauthorized action.
    - **500**: Internal server error.

---

### Post Routes

#### **Create Post**
- **Endpoint**: `POST /api/community/post`
- **Description**: Creates a new post.
- **Request Body**:
    ```json
    {
        "title": "Legal Advice Needed",
        "description": "I need help with filing a complaint."
    }
    ```
- **Headers**:
    - `Authorization`: Bearer token
- **Response**:
    - **200**: Post created successfully.
    - **400**: Missing fields or userId.
    - **500**: Internal server error.

#### **Get All Posts**
- **Endpoint**: `GET /api/community/post`
- **Description**: Retrieves all posts.
- **Headers**:
    - `Authorization`: Bearer token
- **Response**:
    - **200**: List of posts.
    - **500**: Internal server error.

---

### Comment Routes

#### **Add Comment**
- **Endpoint**: `POST /api/community/comments/add-comment/:id`
- **Description**: Adds a comment to a post.
- **Request Body**:
    ```json
    {
        "text": "This is a comment."
    }
    ```
- **Headers**:
    - `Authorization`: Bearer token
- **Response**:
    - **201**: Comment added successfully.
    - **400**: Missing fields or userId.
    - **500**: Internal server error.

---

## Contributing

We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push them to your fork.
4. Submit a pull request.

---


---

## Contact

For questions or support, please contact [vhatti14@gmail.com](mailto:vhatti14@gmail.com).
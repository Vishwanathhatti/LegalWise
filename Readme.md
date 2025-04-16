# LegalWise API Documentation

## Overview
This document provides an overview of the API endpoints available in the LegalWise project, including their descriptions, required data, and status codes.

---

## Table of Contents
- [User Routes](#user-routes)
- [Conversation Routes](#conversation-routes)
- [Message Routes](#message-routes)
- [Post Routes](#post-routes)
- [Comment Routes](#comment-routes)

---

## User Routes

### **Register User**
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

### **Login**
- **Endpoint**: `POST /api/user/login`
- **Description**: Logs in a user.
- **Request Body**:
    ```json
    {
        "email": "john.doe@example.com",
        "password": "password123",
        "deviceId": "device123",
        "deviceInfo": "Browser Info"
    }
    ```
- **Response**:
    - **200**: Login successful.
    - **400**: Invalid credentials or missing fields.
    - **500**: Internal server error.

### **Logout**
- **Endpoint**: `GET /api/user/logout`
- **Description**: Logs out a user.
- **Headers**:
    - `Authorization`: Bearer token
- **Response**:
    - **200**: Logout successful.
    - **400**: Missing userId or deviceId.
    - **500**: Internal server error.

---

## Conversation Routes

### **Create Conversation**
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

### **Get User Conversations**
- **Endpoint**: `GET /api/conversation/get`
- **Description**: Retrieves all conversations for a user.
- **Headers**:
    - `Authorization`: Bearer token
- **Response**:
    - **200**: List of conversations.
    - **400**: Unable to fetch userId.
    - **500**: Internal server error.

---

## Message Routes

### **Add Message**
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

## Post Routes

### **Create Post**
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

### **Get All Posts**
- **Endpoint**: `GET /api/community/post`
- **Description**: Retrieves all posts.
- **Headers**:
    - `Authorization`: Bearer token
- **Response**:
    - **200**: List of posts.
    - **500**: Internal server error.

---

## Comment Routes

### **Add Comment**
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

### **Get Post Comments**
- **Endpoint**: `GET /api/community/comments/:id`
- **Description**: Retrieves comments for a specific post.
- **Headers**:
    - `Authorization`: Bearer token
- **Response**:
    - **200**: List of comments.
    - **404**: Post not found.
    - **500**: Internal server error.

---

## Status Codes
- **200**: Success
- **201**: Resource created
- **400**: Bad request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not found
- **500**: Internal server error
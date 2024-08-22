# EvitalRx_Assignment

This is project assignment from EvitalRx as part of FullStack Developer interview process.

# Overview

This project consists of a client-side React application and a backend server built with Node.js and Express. The client communicates with the backend API for user authentication, profile management, and other functionalities.

## Prerequisites

Before running the project, ensure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (or a MongoDB cloud service)

## Project Structure

- `client/` - Contains the React frontend application.
- `backend/` - Contains the Node.js and Express backend server.

## Setup Instructions

### 1. Backend Setup

Navigate to the `backend` directory:

````bash
cd backend

### Create a .env file in the backend directory and populate it with the following values:
```bash
PORT=8080
JWT_SECRET='fef4335435@324%fdvd'
MONGO_URI='your_mongo_uri'
CLIENT_URL='http://localhost:5173'
NODE_ENV='development'
SENDERS_MAIL='your_gmail_account'
SENDERS_PASSWORD='unsecure_app_password'

### Install backend dedpendencies and then start the backend server:
```bash
npm install
npm run dev


### 2. Client Setup

Navigate to the `backend` directory:

```bash
cd client

### Create a .env file in the backend directory and populate it with the following values:
```bash
REACT_APP_API_URL='http://localhost:8080/api/auth'
REACT_APP_BASE='/api/auth/'

### Install backend dedpendencies and then start the backend server:
```bash
npm install
npm run dev

The client application will start on http://localhost:5173


### 3. Email Configuration

To send emails from the backend:
Gmail: You need to enable "Less secure app access" or use an App Password if you have 2-Step Verification enabled. The SENDERS_PASSWORD in the .env file should be this app password.



## Common Issues
Backend not starting: Ensure MongoDB is running and the MONGO_URI in the .env file is correct.
Client not loading: Ensure the backend server is running and accessible at http://localhost:8080.
Email sending issues: Double-check the Gmail settings and app password.
````

# User Registration Flow Overview

This document explains how the new user registration feature works in the project, including how control moves from one file to another.

## 1. Registration page collects user input
File: `src/app/register/page.js`

This is the frontend page where the user fills in the registration form.

What it does:
- Stores the form values in state using `useState`.
- Updates the form data whenever the user types into an input field.
- When the user clicks the Register button, it calls the `registerNewUser` function.

Key part:
- `handleRegisterOnSubmit()` is triggered on button click.
- It sends the collected form data to the service layer.

## 2. Service layer sends the request to the backend
File: `src/services/register/index.js`

This file acts as a bridge between the frontend page and the backend API.

What it does:
- Defines `registerNewUser(formData)`.
- Sends a `POST` request to `/api/register`.
- Converts the form data into JSON using `JSON.stringify(formData)`.
- Waits for the server response and returns it.

In simple terms:
- The frontend sends the user details.
- The backend responds with success or error information.

## 3. API route receives and processes the request
File: `src/app/api/register/route.js`

This is the main backend logic for registration.

What it does:
- Receives the incoming request in `POST(req)`.
- Connects to MongoDB using `connectToDB()`.
- Reads the data sent from the frontend.
- Validates the input using Joi.
- Checks whether a user with the same email already exists.
- Hashes the password for security.
- Saves the new user in the database.
- Returns a JSON response like success or failure.

Important checks inside this file:
- Validation check
- Duplicate email check
- Password hashing
- User creation

## 4. Database connection file
File: `src/database/index.js`

This file connects the application to MongoDB.

What it does:
- Uses `mongoose.connect(...)` to connect to the database.
- Provides the connection function used by the registration API route.

## 5. User model defines the database structure
File: `src/models/user.js`

This file defines how a user document should look in MongoDB.

What it does:
- Creates a Mongoose schema with fields like:
  - `name`
  - `email`
  - `password`
  - `role`
- Creates the `User` model used for database operations.

## 6. Form control definitions
File: `src/utils/index.js`

This file defines the form fields shown on the register page.

What it does:
- Creates the array `registrationFormControls`.
- Provides the labels, placeholders, input types, and select options for the form.

## Flow summary
The full flow is:

1. User enters data in the register page.
2. The page calls `registerNewUser(...)`.
3. The service sends the data to `/api/register`.
4. The API route validates and processes the data.
5. The route connects to MongoDB and saves the new user.
6. The API returns a success or failure response.

## Very short explanation
- Frontend collects data
- Service sends it to backend
- Backend validates and saves it
- Database stores the user
- Response is returned to the frontend

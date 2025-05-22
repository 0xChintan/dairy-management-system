
# Dairy Management System

This project manages dairy customer entries, bills, and customers with **Node.js backend**, **MongoDB** database, and a **React frontend**. It integrates **Supabase** for authentication and role-based access control.

---

## 📁 Backend

### Overview

- **Node.js** + **Express** REST API  
- MongoDB (via Mongoose) for data storage: customers, entries, and bills collections  
- JWT authentication with role-based access (`user` and `staff`)  
- Secure APIs to allow customers to access their own data and staff to manage all data  
- Seed script to populate sample data  

### Features

- **Customers:** Manage customer info (name, address, phone, email)  
- **Entries:** Records of product entries per customer (product, quantity, price)  
- **Bills:** Monthly billing info per customer (month, year, amount, paid status)  
- Authentication with **JWT** tokens  
- Role-based access:  
  - Customers can only access their own entries and bills  
  - Staff users can manage everything  

### Installation & Run

```bash
cd backend
npm install
# Create a `.env` file with:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret_key

node seeder.js  # Optional: seed sample data
npm start       # Start server on default port 3000
```

---

## 🌐 Frontend

### Overview

- React app to display customers, entries, and bills data  
- Uses **Supabase** client for authentication (login, signup, session management)  
- Calls backend API endpoints with JWT token obtained via Supabase auth  
- Displays data according to user role:  
  - Regular users see their own data  
  - Staff can see and manage all data  

### Features

- Login and signup with Supabase authentication  
- Dashboard to view customer entries and bills  
- Forms to create or update entries and bills (staff only)  
- Role-based UI: hide/show features based on user role from Supabase JWT  

### How it works with backend

1. User signs in via Supabase, receiving JWT access token.  
2. Frontend includes the token in HTTP `Authorization` header when calling backend APIs.  
3. Backend verifies JWT token and user role to allow or deny access.  
4. Data fetched from MongoDB is returned according to user role restrictions.  

### Run Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 About Supabase Integration

- Supabase is used **only for authentication** and role management.  
- The backend **does not store user credentials**; instead, it verifies the JWT issued by Supabase.  
- Supabase JWT contains user ID (`auth.uid()`) and role (`auth.jwt()->>'role'`).  
- Backend routes use middleware to validate JWT and enforce role-based access.  
- This provides a secure and scalable way to handle user sessions without managing password storage yourself.  

---

## 🛠️ Tech Stack

| Layer          | Technology                         |
| -------------- | --------------------------------- |
| Backend        | Node.js, Express, Mongoose, MongoDB |
| Frontend       | React, Supabase JS Client          |
| Authentication | Supabase Auth + JWT                |

---

## 🚀 Next Steps

- Add more detailed role permissions  
- Implement advanced filtering & pagination  
- Add testing (unit/integration)  
- Deploy backend and frontend with environment config  

---# dairy-management-system

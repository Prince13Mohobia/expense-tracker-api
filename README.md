# Expense Tracker API

A secure and scalable Expense Tracker REST API built with Node.js, Express.js, MongoDB, and JWT Authentication. The application allows users to manage expenses, generate analytics, export reports, and receive expense reports via email.

## 🚀 Features

### Authentication

* OTP-based Login
* JWT Authentication
* Protected Routes
* User Authorization

### Expense Management

* Create Expense
* Get All Expenses
* Update Expense
* Delete Expense

### Advanced Features

* Pagination
* Search Expenses
* Category Filtering
* Sorting

### Analytics

* Dashboard Statistics
* Monthly Expense Summary
* Category-wise Summary
* Date Range Summary
* Top 5 Highest Expenses

### Export Reports

* Export Expenses as CSV
* Export Expenses as Excel
* Export Expenses as PDF
* Email Expense Report

### Documentation

* Swagger API Documentation

### Error Handling

* Centralized Error Handling Middleware

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Authentication

* JWT
* OTP Verification

### Documentation

* Swagger UI

### Reports

* ExcelJS
* JSON2CSV
* PDFKit

### Email Service

* Resend

### Deployment

* Render

---

## 📂 Project Structure

```bash
expense-tracker-api/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
│
├── uploads/
│
├── server.js
├── package.json
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

JWT_EXPIRE=24h

RESEND_API_KEY=your_resend_api_key
```

---

## 📦 Installation

Clone Repository

```bash
git clone https://github.com/Prince13Mohobia/expense-tracker-api.git
```

Navigate to Project

```bash
cd expense-tracker-api
```

Install Dependencies

```bash
npm install
```

Run Development Server

```bash
npm run dev
```

Run Production Server

```bash
npm start
```

---

## 📚 API Documentation

Swagger Documentation

```text
http://localhost:5000/api-docs
```

Production

```text
https://expense-tracker-api-6ims.onrender.com/api-docs
```

---

## 🔗 API Endpoints

### Authentication

| Method | Endpoint             |
| ------ | -------------------- |
| POST   | /api/auth/send-otp   |
| POST   | /api/auth/verify-otp |

### Expenses

| Method | Endpoint          |
| ------ | ----------------- |
| POST   | /api/expenses     |
| GET    | /api/expenses     |
| PUT    | /api/expenses/:id |
| DELETE | /api/expenses/:id |

### Analytics

| Method | Endpoint                       |
| ------ | ------------------------------ |
| GET    | /api/expenses/summary          |
| GET    | /api/expenses/monthly-summary  |
| GET    | /api/expenses/category-summary |
| GET    | /api/expenses/date-summary     |
| GET    | /api/expenses/top-expenses     |
| GET    | /api/expenses/dashboard        |

### Reports

| Method | Endpoint                   |
| ------ | -------------------------- |
| GET    | /api/expenses/export/csv   |
| GET    | /api/expenses/export/excel |
| GET    | /api/expenses/export/pdf   |
| POST   | /api/expenses/email-report |

---

## 🌐 Deployment

Backend deployed on Render:

https://expense-tracker-api-6ims.onrender.com

---

## 👨‍💻 Author

Prince Mohobia

GitHub:
https://github.com/Prince13Mohobia

LinkedIn:
https://www.linkedin.com

---

## ⭐ Future Enhancements

* React Frontend
* Charts & Graphs
* User Profile Management
* Budget Tracking
* Notifications
* Cloud File Storage
* Role Based Access Control

---

## 📄 License

This project is licensed under the MIT License.

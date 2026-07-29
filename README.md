# 💰 FinFix

<div align="center">

### Modern Personal Finance Tracker built with MERN Stack + TypeScript

Manage your income and expenses, visualize financial insights, and keep complete control over your personal finances through a secure and responsive dashboard.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-5-black?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)]()

### 🌐 Live Demo

### https://finfix-puce.vercel.app/

</div>

---

# 📖 Overview

FinFix is a full-stack personal finance management application that helps users monitor, organize, and analyze their financial activities through an intuitive dashboard.

The application provides secure authentication, email verification, transaction management, financial analytics, interactive charts, profile management, and responsive user experience.

Designed using modern software engineering practices, FinFix demonstrates scalable architecture, clean code organization, and production-ready backend development.

---

# ✨ Features

## 🔐 Authentication

- User Registration
- Secure Login
- JWT Authentication
- HTTP-only Cookie Authentication
- Email OTP Verification
- Forgot Password
- Change Password
- Protected Routes

---

## 💳 Finance Management

- Add Income
- Add Expense
- Edit Transactions
- Delete Transactions
- Categorize Transactions
- Transaction History

---

## 📊 Analytics Dashboard

- Financial Summary Cards
- Income vs Expense Analytics
- Expense Distribution Pie Chart
- Dashboard Statistics
- Real-time Balance Overview

---

## 📑 Transaction Management

- Server-side Pagination
- Filtering
- Sorting
- Responsive Transaction Table
- Empty State Handling

---

## 👤 Profile Management

- Update Profile Information
- Upload Profile Picture
- Change Password

---

# 🚀 Tech Stack

## Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hook Form
- Zod
- Recharts
- Sonner
- Lucide React

---

## Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcrypt
- Nodemailer
- Multer
- Cookie Parser

---

# 🏗 Architecture

The backend follows a **Feature-Based Modular Architecture**, where every business domain is organized independently.

```
src
│
├── config
│
├── middleware
│
├── modules
│   ├── user
│   ├── expense
│   └── ...
│
├── templates
│
├── utils
│
└── index.ts
```

Each module contains its own:

- Controller
- Routes
- Model
- Interface
- Business Logic

This architecture improves scalability, maintainability, and code organization.

---

# 📁 Project Structure

```
FinFix
│
├── finfix-ui
│   ├── src
│   ├── components
│   ├── pages
│   ├── layouts
│   ├── hooks
│   ├── services
│   ├── store
│   └── utils
│
└── finfix-server
    ├── src
    │   ├── config
    │   ├── middleware
    │   ├── modules
    │   │   ├── expense
    │   │   └── user
    │   ├── templates
    │   ├── utils
    │   └── index.ts
```

---

# 📊 Dashboard

The dashboard provides complete financial insights through interactive visualizations.

- Total Balance
- Total Income
- Total Expense
- Income vs Expense Graph
- Expense Distribution Pie Chart
- Recent Transactions

---

# ⚡ Key Highlights

- Feature-Based Backend Architecture
- Full TypeScript Implementation
- Secure JWT Authentication
- Email OTP Verification
- RESTful API Design
- Responsive Dashboard
- Server-side Pagination
- Dynamic Filtering
- Dynamic Sorting
- Interactive Charts
- Profile Management
- Clean Folder Structure

---

# 🔒 Authentication Flow

```
User Registration
        │
        ▼
Email OTP Verification
        │
        ▼
Secure Login
        │
        ▼
JWT Token
        │
        ▼
Protected Dashboard
```

---



# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/sharmasatyam121104-devloper/finfix

cd finfix
```

---

## Install Frontend

```bash
cd finfix-ui

npm install
```

---

## Install Backend

```bash
cd finfix-server

npm install
```

---

# 🔑 Environment Variables

## Backend

Create a `.env` file inside **finfix-server**

```env
PORT=

MONGO_URI=

JWT_SECRET=

JWT_REFRESH_SECRET=

EMAIL_USER=

EMAIL_PASSWORD=
```

---

## Start Backend

```bash
npm run dev
```

---

## Start Frontend

```bash
npm run dev
```

---

# 📈 Future Improvements

- Budget Planning
- Export Transactions
- CSV Reports
- PDF Reports
- Monthly Budget Goals
- Dark Mode
- Multi-Currency Support
- Spending Insights
- Recurring Transactions

---

# 💼 Skills Demonstrated

- MERN Stack Development
- TypeScript
- REST API Development
- Authentication & Authorization
- MongoDB Data Modeling
- Responsive UI Development
- Dashboard Design
- Data Visualization
- Form Validation
- Clean Architecture
- Production Deployment

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push to your branch.
5. Open a Pull Request.

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

## Satyam Sharma

**Full Stack MERN Developer**

GitHub

https://github.com/sharmasatyam121104-devloper

Portfolio

https://satyam-sharma.netlify.app

---

<div align="center">

### ⭐ If you found this project helpful, consider giving it a star.

Built with ❤️ using React, TypeScript, Node.js, Express, and MongoDB.

</div>

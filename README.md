# 📋 Attendance & HR Management System

A RESTful backend API for managing employee attendance, shifts, departments, and generating monthly/yearly reports. Built with **Node.js**, **Express**, and **MongoDB**.

---

## ✨ Features

- **User Management** — Sign up, log in, update, soft-delete, and list employees with role-based access (Admin / User).
- **Department Management** — Create, update, soft-delete, and retrieve departments with virtual employee population.
- **Shift Management** — Define work shifts with start/end times, assign employees, and link shifts to departments.
- **Attendance Tracking** — Record daily attendance (Present, Absent, Late, Leave), bulk-import from Excel files, and manage incentives.
- **Monthly & Yearly Reports** — Generate attendance reports per employee or across the organization on a monthly and yearly basis.
- **File Uploads** — Excel import for bulk attendance via Multer; image uploads via Cloudinary.
- **Authentication & Authorization** — JWT-based authentication with bcrypt password hashing.
- **Input Validation** — Request validation using Joi schemas.
- **Email Notifications** — Email support via Nodemailer.

---

## 🛠️ Tech Stack

| Layer          | Technology                        |
| -------------- | --------------------------------- |
| Runtime        | Node.js (ES Modules)              |
| Framework      | Express.js                        |
| Database       | MongoDB + Mongoose                |
| Authentication | JWT (`jsonwebtoken`) + `bcrypt`   |
| Validation     | Joi                               |
| File Upload    | Multer (local) + Cloudinary (cloud) |
| Email          | Nodemailer                        |
| Excel Parsing  | `xlsx`                            |
| PDF Parsing    | `pdf-parse`                       |
| Other          | `cors`, `dotenv`, `slugify`, `nanoid` |

---

## 📁 Project Structure

```
graduation__project/
├── index.js                  # App entry point
├── package.json
├── .env                      # Environment variables
├── .gitignore
│
├── DB/
│   ├── connection.js         # MongoDB connection setup
│   └── models/
│       ├── User.model.js     # User schema (name, nationalId, role, department, shift)
│       ├── attendance.model.js # Attendance schema (userId, date, arrives, leaves, status)
│       ├── depart.model.js   # Department schema (name, virtual employees)
│       └── shift.model.js    # Shift schema (name, startTime, endTime, department)
│
├── src/
│   ├── bootstrap.js          # Route registration & middleware setup
│   ├── middleware/
│   │   ├── auth.js           # JWT authentication middleware
│   │   └── validation.js     # Joi validation middleware
│   ├── modules/
│   │   ├── User/             # User CRUD + auth endpoints
│   │   ├── Department/       # Department CRUD endpoints
│   │   ├── shift/            # Shift CRUD endpoints
│   │   ├── Attendance/       # Attendance CRUD + Excel import
│   │   └── MReport/          # Monthly & yearly report generation
│   └── utils/
│       ├── cloudnairy.js     # Cloudinary configuration
│       ├── cluadnairyMulter.js # Cloudinary + Multer integration
│       ├── multer.js         # Local file upload configuration
│       ├── email.js          # Nodemailer email utility
│       ├── Generate_Varify.js # JWT token generation & verification
│       ├── Hash_Compare.js   # Bcrypt hash & compare helpers
│       ├── errorHandler.js   # Global error handling middleware
│       ├── generalFeildes.js # Shared Joi field definitions
│       ├── createInvoice.js  # Invoice/document generation
│       └── payment.js        # Payment utility
│
└── uploads/                  # Local file upload directory
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **MongoDB** running locally or a remote connection URI
- **npm**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/graduation__project.git
cd graduation__project

# 2. Install dependencies
npm install

# 3. Configure environment variables (see section below)
cp .env.example .env

# 4. Start the development server
npx nodemon index.js
```

The server starts on the port defined in your `.env` file (default: **7000**).

---

## ⚙️ Environment Variables

Create a `.env` file in the project root with the following variables:

```env
PORT=7000
URI=mongodb://localhost:27017/Graduation_Project

MOOD=DEV

# Cloudinary
CLOUD_NAME=your_cloud_name
API_KEY=your_api_key
API_SECRETE=your_api_secret

# Auth
APP_NAME=Ecommerce
TOKEN_SEGNATURE=your_token_secret
SIGNUP_SEGNATURE=your_signup_secret
CONFIRM_SIGNATURE=your_confirm_secret
BEARER_TOKEN=your_bearer_token
SALT_ROUND=8

# Email (Nodemailer)
EMAIL=your_email@example.com
PASSWORD=your_app_password
CONFIRM_EMAIL=your_confirm_email@example.com
```

---

## 📡 API Endpoints

### User — `/user`

| Method | Endpoint     | Description                |
| ------ | ------------ | -------------------------- |
| POST   | `/signUp`    | Register a new user        |
| GET    | `/logIn`     | Log in an existing user    |
| PUT    | `/update`    | Update user details        |
| PUT    | `/delete`    | Soft-delete a user         |
| GET    | `/getAll`    | Get all users              |
| GET    | `/getById`   | Get a single user by ID    |

### Department — `/department`

| Method | Endpoint      | Description               |
| ------ | ------------- | ------------------------- |
| POST   | `/addDepart`  | Create a new department   |
| GET    | `/getById`    | Get department by ID      |
| GET    | `/getAll`     | Get all departments       |
| PUT    | `/update`     | Update a department       |
| PUT    | `/delete`     | Soft-delete a department  |

### Shift — `/shift`

| Method | Endpoint        | Description             |
| ------ | --------------- | ----------------------- |
| POST   | `/createShift`  | Create a new shift      |
| GET    | `/getAll`       | Get all shifts          |
| GET    | `/getId`        | Get shift by ID         |
| PUT    | `/update`       | Update a shift          |
| PATCH  | `/delete`       | Soft-delete a shift     |

### Attendance — `/attendance`

| Method | Endpoint                  | Description                          |
| ------ | ------------------------- | ------------------------------------ |
| POST   | `/import`                 | Bulk import attendance from Excel    |
| POST   | `/addRecord`              | Add a single attendance record       |
| GET    | `/getRecord`              | Get all attendance records           |
| GET    | `/getById/:employeeCode`  | Get records by employee code         |
| PUT    | `/update`                 | Update an attendance record          |
| DELETE | `/delete/:_id`            | Delete an attendance record          |

### Reports — `/report`

| Method | Endpoint       | Description                                |
| ------ | -------------- | ------------------------------------------ |
| GET    | `/getReport`   | Generate a monthly attendance report       |
| GET    | `/getReports`  | Generate a yearly attendance report        |
| GET    | `/getOne`      | Get monthly report for a specific user     |

---

## 🗃️ Data Models

### User

| Field        | Type       | Description                     |
| ------------ | ---------- | ------------------------------- |
| `name`       | String     | Employee name (required)        |
| `password`   | String     | Hashed password (required)      |
| `nationalId` | String     | Unique national ID (required)   |
| `department` | ObjectId   | Reference to Department         |
| `shift`      | ObjectId   | Reference to Shift              |
| `role`       | String     | `"User"` or `"Admin"`          |
| `building`   | String     | `"Old"` or `"New"`             |
| `isDeleted`  | Boolean    | Soft-delete flag                |
| `note`       | String     | Optional note                   |

### Attendance

| Field        | Type       | Description                              |
| ------------ | ---------- | ---------------------------------------- |
| `userId`     | ObjectId   | Reference to User (required)             |
| `date`       | Date       | Attendance date (required)               |
| `shift`      | ObjectId   | Reference to Shift                       |
| `arrives`    | Date       | Arrival timestamp (required)             |
| `leaves`     | Date       | Departure timestamp (required)           |
| `status`     | String     | `Present`, `Absent`, `Late`, or `Leave`  |
| `incentives` | Number     | Incentive amount (default: 0)            |

### Department

| Field  | Type   | Description                   |
| ------ | ------ | ----------------------------- |
| `name` | String | Department name (required, unique) |

### Shift

| Field        | Type       | Description                       |
| ------------ | ---------- | --------------------------------- |
| `name`       | String     | Shift name (required)             |
| `startTime`  | Date       | Shift start time (required)       |
| `endTime`    | Date       | Shift end time (required)         |
| `department` | ObjectId   | Reference to Department (required)|
| `employees`  | [ObjectId] | Array of User references          |
| `isActive`   | Boolean    | Active status (default: true)     |

---

## 🧪 Postman Collection

A ready-to-use Postman collection is included:

```
graduation_proj.postman_collection.json
```

Import it into [Postman](https://www.postman.com/) to test all available API endpoints.

---

## 📄 License

This project is licensed under the **ISC License**.

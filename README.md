# 🎯 Smart Recruitment Platform

A comprehensive **Recruitment and hiring platform** designed to streamline the hiring process with automated job postings, candidate applications, skill assessments through quizzes, and data-driven hiring decisions.

---

## ✨ Features

### 👨‍💼 **Admin Dashboard**

- Create and manage job postings
- Create skill-based quizzes for candidates
- Review applicants and their quiz scores
- Approve/Reject candidates
- Hire top performers
- View detailed analytics and reports

### 👤 **Candidate Portal**

- User registration and authentication
- Browse available job postings
- Apply for jobs
- Take skill assessment quizzes
- View quiz results and feedback
- Track application status
- View interview results

### 📋 **Core Features**

- **Job Management:** Create, edit, delete job postings with detailed descriptions
- **Quiz System:** Auto-graded skill assessments with time validation
- **Application Tracking:** Real-time status updates (pending → accepted → hired)
- **Email Notifications:** Automated emails for job approvals and interview results
- **Role-Based Access:** Admin and User roles with authentication
- **Secure API:** JWT-based authentication with bcrypt password hashing

---

## 🛠️ Tech Stack

### **Backend**

- **Framework:** Express.js (Node.js)
- **Database:** MongoDB Atlas
- **Authentication:** JWT + bcrypt
- **Email Service:** Nodemailer
- **Deployment:** Render

### **Frontend**

- **Framework:** React 19
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Routing:** React Router v7
- **Deployment:** Vercel

---

## 📦 Installation

### **Prerequisites**

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- Gmail account (for email notifications)

### **1. Clone Repository**

```bash
git clone https://github.com/YOUR_USERNAME/smart.git
cd smart
```

### **2. Backend Setup**

```bash
cd backend
npm install
```

Create `.env` file:

```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/recruitment
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
JWT_SECRET=your_secret_key_here
PORT=5000
```

**Note:** For Gmail, use an [App Password](https://myaccount.google.com/apppasswords) instead of your regular password.

### **3. Frontend Setup**

```bash
cd frontend
npm install
```

Create `.env.local` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🚀 Running Locally

### **Terminal 1 - Backend**

```bash
cd backend
npm start
# Server runs at http://localhost:5000
```

### **Terminal 2 - Frontend**

```bash
cd frontend
npm start
# App runs at http://localhost:3000
```

---

## 🌐 Deployment

### **Backend on Render**

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create Web Service → Connect GitHub repo
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables (MONGODB_URL, EMAIL_USER, EMAIL_PASS, JWT_SECRET)
7. Deploy

### **Frontend on Vercel**

1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repo
3. Set root directory: `frontend`
4. Add environment variable: `REACT_APP_API_URL=https://your-render-backend-url.com/api`
5. Deploy

---

## 📁 Project Structure

```
smart/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   └── authController.js     # Auth logic
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   ├── Quiz.js
│   │   └── QuizResult.js
│   ├── routes/
│   │   └── authRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── utils/
│   │   └── sendEmail.js
│   ├── server.js                 # Main server file
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js          # API configuration
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── AdminRoute.js
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── CreateJob.js
│   │   │   ├── CreateQuiz.js
│   │   │   ├── Quiz.js
│   │   │   └── ...
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

---

## 🔐 Authentication

### **For Admin Access:**

During registration, use this admin key to create an admin account:

```
AdminKey: ADMIN@2026#RECRUITPRO
```

### **Roles**

- **Admin:** Can create jobs, create quizzes, manage applications
- **User:** Can apply for jobs, take quizzes, view results

---

## 📋 API Endpoints

### **Authentication**

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/profile` - Get user profile

### **Jobs**

- `GET /api/jobs` - Get all jobs
- `POST /api/admin/jobs` - Create job (Admin only)
- `PUT /api/admin/jobs/:id` - Update job
- `DELETE /api/admin/jobs/:id` - Delete job

### **Applications**

- `POST /api/apply/:jobId` - Apply for job
- `GET /api/applicants/:jobId` - Get job applicants (Admin only)
- `PUT /api/application/status/:id` - Update application status

### **Quizzes**

- `POST /api/admin/quiz/:jobId` - Create quiz
- `GET /api/quiz/:jobId` - Get quiz
- `POST /api/quiz/submit/:jobId` - Submit quiz
- `GET /api/quiz/results/:jobId` - Get quiz results

---

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check if dependencies are installed
npm install

# Verify .env file exists
# Check MongoDB connection string
```

### Quiz not working

- Ensure admin approval before quiz access (application.status = "accepted")
- Check quiz start/end times are valid
- Verify quiz has questions added

### Frontend can't connect to backend

- Check `REACT_APP_API_URL` in `.env.local`
- Ensure backend is running on correct port
- Check CORS is enabled

---

## 📝 Key Features Implemented

✅ User registration with role-based access
✅ Job creation and management
✅ Quiz system with time validation
✅ Automated application workflow
✅ Email notifications for approvals
✅ Admin dashboard with analytics
✅ Quiz result tracking
✅ Secure authentication with JWT

---

## 🚀 Future Enhancements

- [ ] Video interview support
- [ ] AI-powered candidate ranking
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app
- [ ] Automated follow-up emails
- [ ] Candidate feedback system

---

## 📧 Support

For issues or questions:

1. Check the troubleshooting section
2. Review API documentation
3. Create an issue in GitHub

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Jai Goel** - Full-stack Developer

---

**Happy Recruiting! 🎉**

# HireHub - Job Portal

A full-stack job portal built with the MERN stack. This platform connects job seekers with employers through an intuitive interface.

## 🔗 Live Demo

[View Live Demo](#) <!-- Add your deployed link here -->

## � Screenshots

<!-- Add screenshots here -->

## ✨ Features

### For Job Seekers
- Browse jobs with filters (skills, location, type)
- Apply to jobs with one click
- Track application status
- Upload and manage resume
- Personal dashboard with stats

### For Employers
- Post and manage job listings
- View applicants and download resumes
- Update application status (Applied/Shortlisted/Rejected)
- Control job status (Open/Hiring/Closed)
- Analytics dashboard

### For Admins
- Manage users (block/unblock)
- Moderate job listings
- View platform statistics

## 🛠️ Built With

- **Frontend:** React, React Router, Bootstrap
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** JWT
- **File Storage:** Cloudinary

## � Getting Started

### Prerequisites

- Node.js installed
- MongoDB Atlas account
- Cloudinary account (for file uploads)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/HireHub.git
cd HireHub
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables

Create `.env` in the backend folder:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create `.env` in the frontend folder:
```
VITE_API_URL=http://localhost:5000/api
```

5. Run the application

Start backend:
```bash
cd backend
npm start
```

Start frontend:
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 📁 Project Structure

```
HireHub/
├── backend/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── utils/
│   └── index.html
└── README.md
```

## 🎯 Key Pages

- **Home** - Landing page
- **Login/Register** - Authentication
- **Browse Jobs** - Job listings with filters
- **Dashboard** - Role-based dashboards
- **My Jobs** - Employer job management
- **Applicants** - View and manage candidates
- **Admin Panel** - Platform moderation

## 🔐 User Roles

1. **Job Seeker** - Browse and apply to jobs
2. **Employer** - Post jobs and manage applicants
3. **Admin** - Moderate platform content

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

**Priya Sharma**

- GitHub: [@yourusername](https://github.com/yourusername)

## � Acknowledgments

- Built as a learning project to understand full-stack development
- Inspired by modern job portals like LinkedIn

---

Made with ❤️ using MERN Stack

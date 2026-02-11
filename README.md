📝 Public Notes App (Admin Approval System)
---
A full-stack Notes application built with Next.js 14 (App Router), MongoDB, and JWT authentication, where users can create notes and request them to be made public — but only an admin can approve or reject them.

🚀 Features
--
👤 Authentication

User Signup & Login  
JWT-based authentication  
Protected routes  
Secure password storage (hashed)

📝 Notes

Create private notes  
Request to make a note public  
View your own notes  

🌍 Public Notes

Only approved notes appear publicly  
Public notes show:  
* Title  
* Content  
* Author username  
* Avatar

🛡️ Admin Panel

Only users with isAdmin: true can:

- View pending public requests

- Approve notes

- Reject notes

Public notes require:

- isPublic: true

- isApproved: true

🧠 Tech Stack
--
Frontend: Next.js 14 (App Router)  
Backend: Next.js API Routes  
Database: MongoDB + Mongoose   
Authentication: JWT  
Deployment: Vercel  
Email (Dev): Mailtrap (for verification testing)  

📂 Project Structure
--
src/
 ├── app/  
 │   ├── api/  
 │   │   ├── users/  
 │   │   ├── notes/  
 │   │   ├── admin/  
 │   │   └── public/  
 │   ├── profile/  
 │   ├── admin/  
 │   └── ...  
 │
 ├── components/  
 │
 ├── models/  
 │   ├── userModel.ts  
 │   └── noteModel.ts  
 │
 ├── dbConfig/  
 │   └── dbConfig.ts  
 │
 └── helpers/  
     └── getDataFromToken.ts  

⚙️ Environment Variables
--
Create a .env.local file:

MONGO_URI=your_mongodb_connection_string
TOKEN_SECRET=your_jwt_secret
DOMAIN=http://localhost:3000


For production (Vercel), add these in:

Vercel Dashboard → Settings → Environment Variables

🛠️ Installation
--
git clone https://github.com/kajalsanwalll/fullstack-auth-nextjs.git  
cd fullstack-auth-nextjs  
npm install  
npm run dev  


* App runs at:

http://localhost:3000

🔐 How Admin Approval Works
--
User creates a note

User sets isPublic = true

Note appears in Admin Panel as Pending

Admin:

Approves → isApproved = true

Rejects → isPublic = false

Only approved notes appear in:

/api/public

🌍 Deployment (Vercel)
--
Push project to GitHub

Go to https://vercel.com

Import repository

Add environment variables

Deploy

✅ Your MongoDB must be hosted (e.g., MongoDB Atlas)

📌 Future Improvements
--
🔔 Real-time admin notifications

📧 Production email verification (Resend / SendGrid)

🧾 Pagination for public notes

🖼️ Image upload crop support

🔎 Search functionality

🌙 Dark mode

🎯 Purpose
--
This project demonstrates:

Full-stack development

Secure authentication

Role-based access control

Admin moderation system

Production-ready MongoDB setup

👩‍💻 Author
--
Built by Kajal Sanwal :)
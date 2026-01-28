# 🎓 EMO - Egyptian Math Olympiad Platform

**EMO** (Egyptian Math Olympiad), also known as the **October Math Community Circle (OMCC)**, is a comprehensive web platform designed to manage and facilitate Egypt's premier mathematical academic competition. The platform connects students, coaches, and administrators in a unified ecosystem to promote mathematical excellence and prepare participants for international standards like the IMO (International Mathematical Olympiad).

## 🌟 Overview

EMO serves as a centralized hub for mathematical competitions in Egypt, providing:

- **Competition Registration & Management** - Streamlined registration for students participating in the Egyptian Math Olympiad
- **Multi-Role Dashboard System** - Separate interfaces for Students, Coaches, and Administrators
- **Educational Resources** - Access to preparation materials and competition standards
- **Community Building** - Connecting 5000+ students, 200+ partner schools, and expert mentors

## ✨ Key Features

### 🏆 For Students

- **Competition Registration** - Easy sign-up process with form validation
- **Student Dashboard** - Track progress, access materials, and view competition details
- **Preparation Resources** - Exclusive materials aligned with IMO standards
- **Academic Recognition** - Connect with top universities and institutions

### 👨‍🏫 For Coaches

- **Coach Dashboard** - Manage and mentor student teams
- **Performance Tracking** - Monitor student progress and participation
- **Resource Sharing** - Distribute study materials and problem sets

### 👤 For Administrators

- **Admin Dashboard** - Complete platform oversight and management
- **User Management** - Handle registrations and user roles
- **Competition Organization** - Schedule and coordinate events

### 🎨 Design Highlights

- **Modern, Premium UI** - Beautiful and responsive design using Tailwind CSS
- **Smooth Animations** - Engaging micro-interactions and transitions
- **Accessibility First** - Built with best practices for all users
- **Mobile Responsive** - Seamless experience across all devices

## 🚀 Technology Stack

EMO is built with modern, production-ready technologies:

| Category            | Technology                                                                   |
| ------------------- | ---------------------------------------------------------------------------- |
| **Framework**       | [Next.js 16](https://nextjs.org) (App Router)                                |
| **Language**        | [TypeScript](https://www.typescriptlang.org)                                 |
| **UI Library**      | [React 19](https://react.dev)                                                |
| **Styling**         | [Tailwind CSS v4](https://tailwindcss.com)                                   |
| **Backend**         | [Firebase](https://firebase.google.com) (Authentication, Firestore, Storage) |
| **Admin SDK**       | [Firebase Admin](https://firebase.google.com/docs/admin/setup)               |
| **Form Management** | [React Hook Form](https://react-hook-form.com)                               |
| **Validation**      | [Yup](https://github.com/jquense/yup)                                        |
| **Deployment**      | [Firebase Hosting](https://firebase.google.com/docs/hosting)                 |

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher
- **npm** or **yarn** or **pnpm** or **bun**
- **Firebase Account** with a project created

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd emo
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Configure Firebase

Create a `.env.local` file in the root directory and add your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Place your `firebase-credentials.json` file in the root directory for Firebase Admin SDK.

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
emo/
├── app/                          # Next.js App Router
│   ├── auth/                     # Authentication pages
│   │   ├── login/                # Student login
│   │   └── register/             # Student registration
│   ├── dashboard/                # Role-based dashboards
│   │   ├── admin/                # Admin dashboard
│   │   ├── coach/                # Coach dashboard
│   │   └── student/              # Student dashboard
│   ├── firebase/                 # Firebase client configuration
│   ├── firebase-admin/           # Firebase Admin SDK setup
│   ├── hooks/                    # Custom React hooks
│   ├── server-actions/           # Next.js Server Actions
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/                   # Reusable UI components
│   └── ui/                       # UI component library
├── lib/                          # Utility functions and helpers
├── public/                       # Static assets
├── firebase.json                 # Firebase configuration
├── firestore.rules               # Firestore security rules
├── storage.rules                 # Firebase Storage rules
└── README.md                     # This file
```

## 🔐 Authentication & User Roles

The platform supports three distinct user roles:

1. **Students** - Can register for competitions and access learning materials
2. **Coaches** - Can mentor students and manage teams
3. **Administrators** - Have full platform access and management capabilities

Authentication is handled through Firebase Authentication with role-based access control implemented via Firestore security rules.

## 🎯 Available Scripts

| Command         | Description                                       |
| --------------- | ------------------------------------------------- |
| `npm run dev`   | Start development server at http://localhost:3000 |
| `npm run build` | Build production bundle                           |
| `npm run start` | Start production server                           |
| `npm run lint`  | Run ESLint for code quality                       |

## 🌐 Deployment

The application is configured for deployment on Firebase Hosting. To deploy:

```bash
npm run build
firebase deploy
```

## 📊 Platform Statistics

- **5000+** Active Students
- **200+** Partner Schools
- **150** Awards Granted
- **15** Years Active

## 📄 License

This project is licensed under the terms specified in the [LICENSE](./LICENSE) file.

## 🤝 Contributing

We welcome contributions from the community! Please ensure your code follows the project's coding standards and includes appropriate documentation.

## 📧 Contact & Support

For questions, issues, or support, please contact the OMCC team or open an issue in this repository.

---

**Made with ❤️ for the Egyptian Math Community**

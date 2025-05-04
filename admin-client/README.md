# Hostel Management System - Admin Dashboard

This is the admin dashboard for the Hostel Management System. It provides a comprehensive interface for hostel administrators to manage students, announcements, complaints, outpasses, and community posts.

## Features

- **Authentication**: Secure admin login system
- **Dashboard**: Overview of key statistics and recent activities
- **Student Management**: Register, view, and deactivate student accounts
- **Announcements**: Create and manage announcements for students
- **Complaints Management**: View and resolve student complaints
- **Outpass Management**: Approve or reject student outpass requests
- **Community Posts**: Monitor student community posts

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the admin-client directory
3. Install dependencies:

```bash
npm install
```

### Development

To start the development server:

```bash
npm run dev
```

### Building for Production

To build the application for production:

```bash
npm run build
```

## Initial Setup

Before using the admin dashboard, you need to create an admin user. Run the following script from the server directory:

```bash
node scripts/createAdmin.js
```

This will create an admin user with the following credentials:
- Username: admin
- Password: admin123

## Technologies Used

- React 19
- React Router 6
- Bootstrap 5
- Axios for API requests
- React Hook Form for form handling

## Project Structure

- `src/components`: Reusable UI components
- `src/context`: Context providers for state management
- `src/layouts`: Page layout components
- `src/pages`: Main page components
- `src/App.jsx`: Main application component with routing
- `src/main.jsx`: Application entry point

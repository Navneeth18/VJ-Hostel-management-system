# VJ Hostel Management System - Architecture & User Flow Diagrams

## Table of Contents
1. [High-Level System Architecture](#high-level-system-architecture)
2. [Low-Level Component Architecture](#low-level-component-architecture)
3. [Data Flow Diagram](#data-flow-diagram)
4. [User Flow Diagrams](#user-flow-diagrams)
5. [Database Schema](#database-schema)
6. [Technology Stack](#technology-stack)

---

## High-Level System Architecture

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                       HOSTEL MANAGEMENT SYSTEM                                 │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌──────────────────────────┐         ┌──────────────────────────┐              │
│  │    CLIENT LAYER          │         │    CLIENT LAYER          │              │
│  │  (Admin Portal)          │         │  (Student Portal)        │              │
│  │  - React 19              │         │  - React 19              │              │
│  │  - Bootstrap 5           │         │  - Bootstrap 5           │              │
│  │  - React Router 6        │         │  - React Router 6        │              │
│  └────────────┬─────────────┘         └──────────────┬───────────┘              │
│               │                                      │                           │
│               └──────────────┬───────────────────────┘                           │
│                              │                                                   │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │         API GATEWAY / SERVER LAYER (Node.js + Express)                   │  │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │  │
│  │  │  Routes & Middleware                                              │  │  │
│  │  │  - /admin-api (Admin routes)     - /student-api (Student routes)  │  │  │
│  │  │  - /message-api (Chat)           - /food-api (Food management)    │  │  │
│  │  │  - JWT Authentication            - CORS Headers                   │  │  │
│  │  │  - File Upload (Multer)          - Error Handling                 │  │  │
│  │  └────────────────────────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │  │
│  │  │  Real-time Communication                                           │  │  │
│  │  │  - Socket.IO Server                                                │  │  │
│  │  │  - Community Chat Room                                             │  │  │
│  │  │  - Message Broadcasting                                            │  │  │
│  │  └────────────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
│                              │                                                   │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │         DATABASE LAYER                                                   │  │
│  │  ┌──────────────────────────────────────────────────────────────────┐   │  │
│  │  │  MongoDB                                                         │   │  │
│  │  │  - Student Model         - Room Model                           │   │  │
│  │  │  - Admin Model           - Complaint Model                      │   │  │
│  │  │  - Announcement Model    - Outpass Model                        │   │  │
│  │  │  - Community Post Model  - Message Model                        │   │  │
│  │  │  - Food Model            - Review Model                         │   │  │
│  │  └──────────────────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │         EXTERNAL SERVICES                                                │  │
│  │  - Cloudinary (Image Upload & Storage)                                   │  │
│  │  - JWT (Authentication)                                                  │  │
│  │  - Bcrypt (Password Hashing)                                             │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## Low-Level Component Architecture

### Frontend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    UNIFIED CLIENT                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Entry Point (main.jsx)                              │   │
│  │  - BrowserRouter Setup                               │   │
│  │  - Context Providers (UserContext, AdminContext)     │   │
│  │  - App Component Initialization                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                  │
│                           ▼                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  App.jsx (Router Configuration)                      │   │
│  │  ├─ /login (UnifiedLogin)                            │   │
│  │  ├─ /home/* (Student Routes)                         │   │
│  │  └─ /dashboard/* (Admin Routes)                      │   │
│  └──────────────────────────────────────────────────────┘   │
│          │                          │                       │
│          ▼                          ▼                       │
│  ┌─────────────────────┐   ┌─────────────────────────┐     │
│  │  STUDENT PORTAL     │   │  ADMIN PORTAL           │     │
│  ├─────────────────────┤   ├─────────────────────────┤     │
│  │ StudentLayout       │   │ AdminLayout             │     │
│  │ ├─ Navbar           │   │ ├─ Sidebar              │     │
│  │ │  ├─ Home          │   │ │ ├─ Dashboard          │     │
│  │ │  ├─ Announcements │   │ │ ├─ Students           │     │
│  │ │  ├─ Community     │   │ │ ├─ Rooms              │     │
│  │ │  ├─ Complaints    │   │ │ ├─ Announcements      │     │
│  │ │  ├─ Outpass       │   │ │ ├─ Complaints        │     │
│  │ │  ├─ Food          │   │ │ ├─ Outpasses         │     │
│  │ │  └─ Profile       │   │ │ ├─ Community          │     │
│  │ └─ Content Area     │   │ │ ├─ Food               │     │
│  └─────────────────────┘   │ │ └─ Profile            │     │
│                             │ └─ Content Area        │     │
│                             └─────────────────────────┘     │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  SHARED COMPONENTS & UTILITIES                       │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  ├─ ProtectedRoute (Authentication Guard)           │   │
│  │  ├─ Context Providers (State Management)            │   │
│  │  ├─ API Service (Axios)                             │   │
│  │  ├─ Socket.IO Client (Real-time)                    │   │
│  │  └─ Form Validation (React Hook Form)               │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Backend Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    EXPRESS SERVER                             │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  server.js (Entry Point)                               │  │
│  │  - Express App Creation                                │  │
│  │  - CORS Configuration                                 │  │
│  │  - Static File Serving (/uploads)                     │  │
│  │  - Socket.IO Initialization                           │  │
│  │  - MongoDB Connection                                 │  │
│  └────────────────────────────────────────────────────────┘  │
│                      │                                        │
│      ┌───────────────┼───────────────┬───────────────┐       │
│      ▼               ▼               ▼               ▼       │
│  ┌─────────┐   ┌─────────┐   ┌──────────┐   ┌──────────┐   │
│  │ student │   │ admin   │   │ message  │   │ food     │   │
│  │ -API    │   │ -API    │   │ -API     │   │ -API     │   │
│  └────┬────┘   └────┬────┘   └────┬─────┘   └────┬─────┘   │
│       │             │             │              │         │
│  ┌────▼──────────────▼─────────────▼──────────────▼────┐   │
│  │           MIDDLEWARE LAYER                           │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  ├─ verifyAdminMiddleware (Admin Auth)              │   │
│  │  ├─ verifyStudentMiddleware (Student Auth)          │   │
│  │  ├─ uploadMiddleware (File Uploads)                 │   │
│  │  │  ├─ uploadProfilePhoto                           │   │
│  │  │  ├─ uploadComplaintImage                         │   │
│  │  │  └─ uploadCommunityPostImage                     │   │
│  │  ├─ Error Handling Middleware                        │   │
│  │  └─ CORS Middleware                                 │   │
│  └────┬──────────────────────────────────────────────────┘  │
│       │                                                      │
│  ┌────▼──────────────────────────────────────────────────┐  │
│  │           MODELS LAYER (Mongoose)                    │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  ├─ StudentModel                                     │  │
│  │  ├─ AdminModel                                       │  │
│  │  ├─ RoomModel                                        │  │
│  │  ├─ AnnouncementModel                                │  │
│  │  ├─ ComplaintModel                                   │  │
│  │  ├─ OutpassModel                                     │  │
│  │  ├─ CommunityPostModel                               │  │
│  │  ├─ MessageModel                                     │  │
│  │  ├─ FoodModel                                        │  │
│  │  └─ ReviewModel                                      │  │
│  └────┬──────────────────────────────────────────────────┘  │
│       │                                                      │
│  ┌────▼──────────────────────────────────────────────────┐  │
│  │           MONGODB DATABASE                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  SOCKET.IO (Real-time Communication)                │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  ├─ Connection Handler                               │  │
│  │  ├─ sendMessage Event                                │  │
│  │  ├─ sendImageMessage Event                           │  │
│  │  ├─ Community Room Broadcast                         │  │
│  │  └─ Disconnect Handler                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌──────────────────┐
│    User Client   │
│   (Browser)      │
└────────┬─────────┘
         │
         │ HTTP/WebSocket
         ▼
┌──────────────────────────────────────┐
│    Express Server + Socket.IO        │
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐  │
│  │  Request Handler               │  │
│  │  ├─ Parse Request Body         │  │
│  │  ├─ Verify JWT Token           │  │
│  │  └─ Validate User Permissions  │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │  Business Logic                │  │
│  │  ├─ Room Allocation            │  │
│  │  ├─ Student Management         │  │
│  │  ├─ Complaint Processing       │  │
│  │  └─ Outpass Approval           │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │  Data Processing               │  │
│  │  ├─ Encrypt Passwords (Bcrypt)│  │
│  │  ├─ Upload Images (Cloudinary)│  │
│  │  └─ Format Responses           │  │
│  └────────────────────────────────┘  │
└────────────┬───────────────────────────┘
             │
             │ CRUD Operations
             ▼
┌──────────────────────────────────────┐
│      MongoDB Database                │
├──────────────────────────────────────┤
│  ├─ Students Collection              │
│  ├─ Admins Collection                │
│  ├─ Rooms Collection                 │
│  ├─ Announcements Collection         │
│  ├─ Complaints Collection            │
│  ├─ Outpasses Collection             │
│  ├─ CommunityPosts Collection        │
│  ├─ Messages Collection              │
│  ├─ Food Collection                  │
│  └─ Reviews Collection               │
└──────────────────────────────────────┘
```

---

## User Flow Diagrams

### 1. Student Login & Authentication Flow

```
┌──────────────────┐
│  Open Portal     │
│  localhost:5173  │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────┐
│  Unified Login Page      │
│  (Admin/Student Tabs)    │
└────────┬─────────────────┘
         │
         ├─ Select "Student Portal" Tab
         │
         ▼
┌──────────────────────────┐
│  Enter Credentials       │
│  - Roll Number           │
│  - Password              │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  POST /student-api/login │
└────────┬─────────────────┘
         │
         ├─ Validate Roll Number & Password
         │
         ▼
    ┌─────────────┐
    │  Valid?     │
    └──┬───────┬──┘
    Yes│       │No
       │       │
       ▼       ▼
    ┌──┐   ┌──────────────────┐
    │✓ │   │ Show Error Message│
    └──┘   │ Retry Login      │
       │   └──────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Generate JWT Token          │
│  Store in localStorage       │
│  Store User Data (Context)   │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Redirect to /home           │
│  (StudentLayout + Navbar)    │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Dashboard              │
│  - Home Page            │
│  - Announcements        │
│  - Community            │
│  - Complaints           │
│  - Outpass              │
│  - Food Menu            │
│  - Profile              │
└──────────────────────────┘
```

### 2. Admin Login & Authentication Flow

```
┌──────────────────┐
│  Open Portal     │
│  localhost:5173  │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────┐
│  Unified Login Page      │
│  (Admin/Student Tabs)    │
└────────┬─────────────────┘
         │
         ├─ Select "Admin Portal" Tab
         │
         ▼
┌──────────────────────────┐
│  Enter Credentials       │
│  - Username              │
│  - Password              │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  POST /admin-api/login   │
└────────┬─────────────────┘
         │
         ├─ Validate Username & Password
         │
         ▼
    ┌─────────────┐
    │  Valid?     │
    └──┬───────┬──┘
    Yes│       │No
       │       │
       ▼       ▼
    ┌──┐   ┌──────────────────┐
    │✓ │   │ Show Error Message│
    └──┘   │ Retry Login      │
       │   └──────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Generate JWT Token (24h)    │
│  Store in localStorage       │
│  Store Admin Data (Context)  │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Redirect to /dashboard      │
│  (AdminLayout + Sidebar)     │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  Admin Dashboard                 │
│  - Dashboard (Stats)             │
│  - Student Management            │
│  - Room Management               │
│  - Announcements                 │
│  - Complaint Management          │
│  - Outpass Approval              │
│  - Community Monitoring          │
│  - Food Management               │
│  - Admin Profile                 │
└──────────────────────────────────┘
```

### 3. Student Registration & Room Allocation Flow

```
┌──────────────────────────┐
│  Admin Initiates         │
│  Student Registration    │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  POST /admin-api/            │
│  student-register            │
└────────┬─────────────────────┘
         │
         ├─ Input: Student Details
         │  - Name, Roll Number, Branch
         │  - Year, Phone, Email
         │  - Parent Mobile, Password
         │
         ▼
┌──────────────────────────────┐
│  Check if Student Exists     │
└────────┬─────────────────────┘
         │
    ┌────┴────┐
    │          │
Exists│       Doesn't Exist
    │          │
    ▼          ▼
┌────────┐  ┌──────────────────┐
│ Error  │  │ Proceed with      │
│ (400)  │  │ Room Allocation   │
└────────┘  └────────┬─────────┘
                     │
                     ▼
         ┌──────────────────────────┐
         │ Auto Room Allocation     │
         │ Algorithm:               │
         │ 1. Find partial rooms    │
         │ 2. Prioritize 2+ occupant│
         │ 3. Check capacity        │
         │ 4. Assign room           │
         └────────┬─────────────────┘
                  │
                  ▼
    ┌─────────────────────────┐
    │ Room Found?             │
    └─┬─────────────────────┬─┘
   Yes│                     │No
      │                     │
      ▼                     ▼
┌──────────────┐   ┌──────────────────┐
│ Assign Room  │   │ Return Error      │
│ Create Student   │ (No rooms/full)  │
└──────┬───────┘   └──────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Update Room Occupants    │
│ Add Student ID           │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Return Success Response  │
│ Student Created +        │
│ Assigned to Room         │
└──────────────────────────┘
```

### 4. Student Outpass Request Flow

```
┌──────────────────────────┐
│  Student Logs In         │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Click "Outpass" in Nav  │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Outpass Page                │
│  (Two Tabs)                  │
│  1. Apply for Outpass        │
│  2. View History             │
└────────┬─────────────────────┘
         │
         ├─ Tab 1: Apply for Outpass
         │
         ▼
┌──────────────────────────────┐
│  Fill Outpass Form           │
│  - From Date & Time          │
│  - To Date & Time            │
│  - Reason                    │
│  - Place/Destination         │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  POST /student-api/          │
│  apply-outpass               │
└────────┬─────────────────────┘
         │
         ├─ Create Outpass Record
         │ - Status: "pending"
         │ - Store Student Info
         │
         ▼
┌──────────────────────────────┐
│  Show Success Message        │
│  Outpass Submitted           │
└────────┬─────────────────────┘
         │
         ├─ Tab 2: View History
         │
         ▼
┌──────────────────────────────┐
│  GET /student-api/           │
│  all-outpasses               │
└────────┬─────────────────────┘
         │
         ├─ Fetch All Student Outpasses
         │
         ▼
┌──────────────────────────────┐
│  Display Outpass History     │
│  - Status: Pending/          │
│           Accepted/Rejected  │
│  - Dates, Reason             │
│  - Admin Comments            │
└──────────────────────────────┘
```

### 5. Admin Outpass Approval Flow

```
┌──────────────────────────┐
│  Admin Logs In           │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Click "Outpasses"       │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Outpass Management Page     │
│  - List All Pending Outpasses│
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  GET /admin-api/             │
│  pending-outpasses           │
└────────┬─────────────────────┘
         │
         ├─ Fetch All Pending Requests
         │
         ▼
┌──────────────────────────────┐
│  Display Pending Outpasses   │
│  - Student Details           │
│  - Parent Mobile Number      │
│  - Dates & Reason            │
└────────┬─────────────────────┘
         │
         ├─ Admin Selects Outpass
         │
         ▼
┌──────────────────────────────┐
│  Review Request Details      │
│  - Verify Student Year       │
│  - Check Dates Validity      │
│  - Read Reason               │
└────────┬─────────────────────┘
         │
         ├─ Click "Accept" or "Reject"
         │
         ▼
    ┌─────────────────┐
    │ Admin Decision? │
    └─┬───────────┬───┘
Accept │           │Reject
       │           │
       ▼           ▼
┌────────────┐  ┌────────────┐
│ Status:    │  │ Status:    │
│ Accepted   │  │ Rejected   │
└────┬───────┘  └────┬───────┘
     │                │
     └────┬──────┬────┘
          │
          ▼
┌──────────────────────────────┐
│  PUT /admin-api/             │
│  update-outpass-status/:id   │
└────────┬─────────────────────┘
         │
         ├─ Update Database
         │ - Save Status
         │ - Update Timestamp
         │
         ▼
┌──────────────────────────────┐
│  Send Response to Client     │
│  Refresh Pending List        │
└──────────────────────────────┘
```

### 6. Community Chat Flow

```
┌──────────────────────────┐
│  Student Logs In         │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Click "Community"       │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Community Page              │
│  - Posts Section             │
│  - Chat/Message Section      │
└────────┬─────────────────────┘
         │
         ├─ Two Tabs:
         │ 1. Posts (Community Feed)
         │ 2. Chat (Real-time messaging)
         │
         ▼
┌──────────────────────────────┐
│  Socket.IO Connection        │
│  socket.connect('localhost') │
└────────┬─────────────────────┘
         │
         ├─ Join 'community' room
         │
         ▼
┌──────────────────────────────┐
│  Student Types & Sends Msg   │
│  Input: Message + Profile    │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  socket.emit('sendMessage')  │
│  or                          │
│  socket.emit('sendImageMsg') │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Server Receives Message     │
│  - Validate Data             │
│  - Save to MongoDB           │
│  (Message Model)             │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Broadcast to Community      │
│  io.to('community')          │
│  .emit('newMessage', msg)    │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  All Connected Users         │
│  Receive Message in Real-time│
│  - Display with Photo        │
│  - Show Timestamp            │
│  - Admin Badge (if admin)    │
└──────────────────────────────┘
```

### 7. Room Management Flow

```
┌──────────────────────────┐
│  Admin Logs In           │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Click "Rooms"           │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Room Management Page        │
│  - Tabs: All/Vacant/Occupied │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  GET /admin-api/rooms        │
└────────┬─────────────────────┘
         │
         ├─ Fetch All Rooms with
         │ - Occupancy Details
         │ - Capacity Info
         │ - Student List
         │
         ▼
┌──────────────────────────────┐
│  Display Room Matrix         │
│  - Room Number               │
│  - Occupancy Level           │
│  - Capacity                  │
│  - Student Names             │
└────────┬─────────────────────┘
         │
         ├─ Admin Can:
         │
         ├─ 1. Transfer Student
         │ │
         │ ├─ Select Student
         │ ├─ Select New Room
         │ ├─ PUT /admin-api/
         │ │    change-student-room
         │ │
         │ └─ Update Database
         │
         ├─ 2. Exchange Rooms
         │ │
         │ ├─ Select 2 Students
         │ ├─ PUT /admin-api/
         │ │    exchange-student-rooms
         │ │
         │ └─ Swap Room Numbers
         │
         └─ 3. Unassign Room
             │
             ├─ Select Student
             ├─ PUT /admin-api/
             │    unassign-student-room
             │
             └─ Clear Room Assignment
```

### 8. Complaint Management Flow

```
┌──────────────────────────┐
│  Student Logs In         │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Click "Complaints"      │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Complaints Page             │
│  - Two Tabs:                 │
│  1. Post Complaint           │
│  2. View Complaint History   │
└────────┬─────────────────────┘
         │
         ├─ Tab 1: Post Complaint
         │
         ▼
┌──────────────────────────────┐
│  Complaint Form              │
│  - Title                     │
│  - Description               │
│  - Optionally: Attach Image  │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  POST /student-api/          │
│  post-complaint              │
└────────┬─────────────────────┘
         │
         ├─ Save Complaint
         │ - Status: "active"
         │ - Student Info
         │ - Timestamp
         │ - Upload Image (Cloudinary)
         │
         ▼
┌──────────────────────────────┐
│  Show Success Message        │
│  Complaint Submitted         │
└────────┬─────────────────────┘
         │
         ├─ Tab 2: View History
         │
         ▼
┌──────────────────────────────┐
│  GET /student-api/           │
│  complaints                  │
└────────┬─────────────────────┘
         │
         ├─ Fetch Student Complaints
         │
         ▼
┌──────────────────────────────┐
│  Display Complaint List      │
│  - Status: Active/Solved     │
│  - Title, Description        │
│  - Date Submitted            │
│  - Image (if any)            │
└──────────────────────────────┘

──────────────────────────────────

┌──────────────────────────┐
│  ADMIN SIDE              │
│  Complaint Management    │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Click "Complaints"          │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  GET /admin-api/             │
│  get-active-complaints       │
└────────┬─────────────────────┘
         │
         ├─ Fetch Active Complaints
         │
         ▼
┌──────────────────────────────┐
│  Display Active Complaints   │
│  - Student Details           │
│  - Complaint Content         │
│  - Supporting Images         │
└────────┬─────────────────────┘
         │
         ├─ Admin Reviews & Takes Action
         │
         ▼
┌──────────────────────────────┐
│  Click "Mark as Solved"      │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  PUT /admin-api/             │
│  mark-complaint-solved/:id   │
└────────┬─────────────────────┘
         │
         ├─ Update Status → "solved"
         │ - Update Timestamp
         │
         ▼
┌──────────────────────────────┐
│  Complaint Removed from List │
│  Refreshed View              │
└──────────────────────────────┘
```

---

## Database Schema

```
┌─────────────────────────────────────────┐
│            STUDENT COLLECTION           │
├─────────────────────────────────────────┤
│ _id                  : ObjectId         │
│ name                 : String           │
│ rollNumber           : String (unique)  │
│ branch               : String           │
│ year                 : Number (1-4)     │
│ profilePhoto         : String (URL)     │
│ phoneNumber          : String           │
│ email                : String (unique)  │
│ password             : String (hashed)  │
│ parentMobileNumber   : String           │
│ roomNumber           : String           │
│ is_active            : Boolean          │
│ createdAt            : Date             │
│ updatedAt            : Date             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│            ADMIN COLLECTION             │
├─────────────────────────────────────────┤
│ _id                  : ObjectId         │
│ username             : String (unique)  │
│ password             : String (hashed)  │
│ name                 : String           │
│ email                : String (unique)  │
│ role                 : String ("admin") │
│ createdAt            : Date             │
│ updatedAt            : Date             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│             ROOM COLLECTION             │
├─────────────────────────────────────────┤
│ _id                  : ObjectId         │
│ roomNumber           : String (unique)  │
│ capacity             : Number (2-3)     │
│ occupants            : [ObjectId]       │
│                        (Student refs)   │
│ createdAt            : Date             │
│ updatedAt            : Date             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│          OUTPASS COLLECTION             │
├─────────────────────────────────────────┤
│ _id                  : ObjectId         │
│ studentId            : ObjectId         │
│ rollNumber           : String           │
│ studentName          : String           │
│ parentMobileNumber   : String           │
│ fromDate             : Date             │
│ toDate               : Date             │
│ reason               : String           │
│ place                : String           │
│ status               : String           │
│                        (pending/        │
│                         accepted/       │
│                         rejected)       │
│ createdAt            : Date             │
│ updatedAt            : Date             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│          COMPLAINT COLLECTION           │
├─────────────────────────────────────────┤
│ _id                  : ObjectId         │
│ studentId            : ObjectId         │
│ studentName          : String           │
│ rollNumber           : String           │
│ title                : String           │
│ description          : String           │
│ image                : String (URL)     │
│ status               : String           │
│                        (active/solved)  │
│ createdAt            : Date             │
│ updatedAt            : Date             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│       ANNOUNCEMENT COLLECTION           │
├─────────────────────────────────────────┤
│ _id                  : ObjectId         │
│ title                : String           │
│ description          : String           │
│ createdAt            : Date             │
│ updatedAt            : Date             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│      COMMUNITY POST COLLECTION          │
├─────────────────────────────────────────┤
│ _id                  : ObjectId         │
│ studentName          : String           │
│ profilePhoto         : String (URL)     │
│ content              : String           │
│ image                : String (URL)     │
│ timestamp            : Date             │
│ createdAt            : Date             │
│ updatedAt            : Date             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         MESSAGE COLLECTION              │
├─────────────────────────────────────────┤
│ _id                  : ObjectId         │
│ senderName           : String           │
│ senderRole           : String           │
│                        (student/admin)  │
│ profilePhoto         : String (URL)     │
│ messageText          : String           │
│ image                : String (URL)     │
│ timestamp            : Date             │
│ createdAt            : Date             │
│ updatedAt            : Date             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│            FOOD COLLECTION              │
├─────────────────────────────────────────┤
│ _id                  : ObjectId         │
│ day                  : String           │
│ breakfastItems       : [String]         │
│ lunchItems           : [String]         │
│ dinnerItems          : [String]         │
│ createdAt            : Date             │
│ updatedAt            : Date             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│           REVIEW COLLECTION             │
├─────────────────────────────────────────┤
│ _id                  : ObjectId         │
│ studentId            : ObjectId         │
│ studentName          : String           │
│ rating               : Number (1-5)     │
│ review               : String           │
│ date                 : Date             │
│ createdAt            : Date             │
│ updatedAt            : Date             │
└─────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend Stack
```
Framework & Libraries:
├─ React 19 (UI Library)
├─ React Router 6 (Navigation)
├─ Bootstrap 5 (UI Components)
├─ Axios (HTTP Client)
├─ React Hook Form (Form Management)
├─ Socket.IO Client (Real-time Communication)
├─ Vite (Build Tool)
└─ Chart.js (Data Visualization)

State Management:
├─ React Context API
├─ UserContext (Student State)
└─ AdminContext (Admin State)

Styling:
├─ Bootstrap CSS
├─ Custom CSS
└─ Inline Styles
```

### Backend Stack
```
Runtime & Framework:
├─ Node.js (Runtime)
├─ Express.js (Web Framework)
└─ Socket.IO (WebSocket Library)

Database & ORM:
├─ MongoDB (NoSQL Database)
└─ Mongoose (ODM)

Authentication & Security:
├─ JWT (jsonwebtoken)
├─ Bcrypt (Password Hashing)
└─ CORS (Cross-Origin Support)

File Handling:
├─ Multer (File Upload)
├─ Cloudinary (Cloud Storage)
└─ Express Static (File Serving)

Utilities:
├─ dotenv (Environment Variables)
├─ express-async-handler (Async Error Handling)
└─ async (Async Operations)
```

---

## API Endpoints Summary

### Student APIs (/student-api)
- `POST /login` - Student login
- `GET /announcements` - Get all announcements
- `POST /post-complaint` - Post complaint
- `GET /complaints` - Get student complaints
- `POST /apply-outpass` - Apply for outpass
- `GET /all-outpasses` - Get outpass history
- `PUT /change-password` - Change password
- `POST /upload-profile-photo` - Upload photo
- `GET /profile` - Get student profile

### Admin APIs (/admin-api)
- `POST /login` - Admin login
- `POST /register` - Admin registration
- `POST /student-register` - Register new student
- `PUT /student-delete` - Deactivate student
- `GET /get-active-students` - Get all active students
- `GET /rooms` - Get all rooms
- `POST /room` - Create room
- `PUT /change-student-room` - Transfer student
- `PUT /exchange-student-rooms` - Exchange rooms
- `POST /allocate-rooms` - Allocate rooms
- `POST /generate-rooms` - Generate all rooms
- `POST /generate-students` - Generate test data
- `GET /pending-outpasses` - Get pending outpasses
- `PUT /update-outpass-status/:id` - Approve/Reject outpass
- `POST /post-announcement` - Create announcement
- `PUT /edit-announcement/:id` - Edit announcement
- `GET /get-community-messages` - Get community posts
- `GET /get-complaints` - Get all complaints
- `PUT /mark-complaint-solved/:id` - Mark complaint solved
- `GET /dashboard-stats` - Get dashboard statistics

### Message APIs (/message-api)
- Socket.IO events for real-time messaging

### Food APIs (/food-api)
- Food menu management endpoints

---

## Security Architecture

```
┌──────────────────────────────────┐
│      SECURITY LAYERS             │
├──────────────────────────────────┤
│                                   │
│  1. AUTHENTICATION                │
│  ├─ JWT Tokens (24h expiry)      │
│  ├─ localStorage Storage          │
│  └─ Token Validation              │
│                                   │
│  2. AUTHORIZATION                 │
│  ├─ Protected Routes              │
│  │  ├─ StudentProtectedRoute      │
│  │  └─ AdminProtectedRoute        │
│  ├─ Middleware Verification       │
│  │  ├─ verifyAdminMiddleware      │
│  │  └─ verifyStudentMiddleware    │
│  └─ Role-based Access             │
│                                   │
│  3. PASSWORD SECURITY             │
│  ├─ Bcrypt Hashing (10 rounds)   │
│  ├─ Pre-save Middleware           │
│  └─ No Plain-text Storage         │
│                                   │
│  4. FILE UPLOADS                  │
│  ├─ Multer Validation             │
│  ├─ Cloudinary Storage            │
│  └─ URL-based Access              │
│                                   │
│  5. DATA VALIDATION               │
│  ├─ Form Validation (Client)      │
│  ├─ Server-side Validation        │
│  └─ Schema Validation (Mongoose)  │
│                                   │
│  6. ERROR HANDLING                │
│  ├─ Try-Catch Blocks              │
│  ├─ Async Error Handler           │
│  └─ Generic Error Messages        │
│                                   │
└──────────────────────────────────┘
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│         DEPLOYMENT ENVIRONMENT                  │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │  Frontend Deployment                     │  │
│  │  ├─ Build: npm run build                 │  │
│  │  ├─ Output: dist/ folder                 │  │
│  │  ├─ Server: Vite development/production │  │
│  │  └─ Port: 5173 (dev)                     │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │  Backend Deployment                      │  │
│  │  ├─ Runtime: Node.js                     │  │
│  │  ├─ Start: node server.js                │  │
│  │  ├─ Port: 4000 (configurable)            │  │
│  │  └─ Environment: .env variables          │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │  Database Deployment                     │  │
│  │  ├─ MongoDB: Local/Cloud (Atlas)         │  │
│  │  ├─ Connection: DBURL env variable       │  │
│  │  └─ Collections: Auto-created            │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │  External Services                       │  │
│  │  ├─ Cloudinary: Image storage            │  │
│  │  │  └─ Credentials in env                │  │
│  │  └─ JWT Secret: Secure env variable      │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## Key Algorithms & Logic

### Room Allocation Algorithm
```
1. Get all rooms sorted by occupancy
2. Separate into:
   - Partially filled (1+ occupants, not full)
   - Empty rooms
3. For each student:
   a. Check partially filled rooms first
   b. If none available, use empty room
   c. Verify capacity not exceeded
   d. Add student ID to room occupants
   e. Save both student and room
4. Prioritizes minimum 2 per room
5. Distributes students efficiently
```

### Real-time Chat Flow
```
1. Client connects via Socket.IO
2. Joins 'community' room
3. Sends message event with data
4. Server validates and saves to DB
5. Broadcasts to all community members
6. All connected clients receive in real-time
7. UI updates instantly without refresh
```

### Auto Room Generation
```
1. Create 12 floors (1-12)
2. Each floor: 39 rooms (01-39)
3. Floors 1-9: Format 101-139, 201-239, etc.
4. Floors 10-12: Format 1001-1039, 1101-1139, 1201-1239
5. Capacity pattern:
   - Rooms ending 36, 39: 2-sharing
   - Rooms ending 37, 38: 3-sharing
6. Total: 468 rooms across hostel
7. Rooms assigned to years by floor
```

---

Generated with comprehensive analysis of the codebase architecture, data models, and user workflows.

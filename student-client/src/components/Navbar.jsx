import React from 'react'
import { useUser } from '../context/UserContext'
import { Home, Bell, Users, MessageSquare, LogOut, User, Utensils } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/custom.css';

function Navbar() {
    const { user } = useUser();
    const location = useLocation();

    return (
        <div className="student-navbar">
            <div className="navbar-header">
                <h1 className="fw-bold">Student Portal</h1>
            </div>

            <nav className="nav-container">
                <NavItem
                    icon={<Home size={20} />}
                    label="Home"
                    to=""
                    isActive={location.pathname === '/student' || location.pathname === '/student/'}
                />
                <NavItem
                    icon={<Bell size={20} />}
                    label="Announcements"
                    to="announcements"
                    isActive={location.pathname.includes('/student/announcements')}
                />
                <NavItem
                    icon={<Users size={20} />}
                    label="Community"
                    to="community"
                    isActive={location.pathname.includes('/student/community')}
                />
                <NavItem
                    icon={<MessageSquare size={20} />}
                    label="Complaints"
                    to="complaints"
                    isActive={location.pathname.includes('/student/complaints')}
                />
                <NavItem
                    icon={<LogOut size={20} />}
                    label="Outpass"
                    to="outpass"
                    isActive={location.pathname.includes('/student/outpass')}
                />
                <NavItem
                    icon={<User size={20} />}
                    label="Student Profile"
                    to="profile"
                    isActive={location.pathname.includes('/student/profile')}
                />
                <NavItem
                    icon={<Utensils size={20} />}
                    label="Food"
                    to="food"
                    isActive={location.pathname.includes('/student/food')}
                />
            </nav>

            <div className="profile-container">
                <div className="profile">
                    {user.profilePhoto ? (
                        <img
                            src={user.profilePhoto}
                            alt="Profile"
                            className="avatar"
                            style={{
                                objectFit: 'cover',
                                padding: 0
                            }}
                        />
                    ) : (
                        <div className="avatar">
                            <span>{user.name ? user.name.charAt(0).toUpperCase() : 'S'}</span>
                        </div>
                    )}
                    <div className="profile-info">
                        <p className="name mb-0">{user.name}</p>
                        <p className="id mb-0">ID: {user.rollNumber}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const NavItem = ({ icon, label, to, isActive }) => {
    return (
        <Link
            to={to}
            className={`nav-item ${isActive ? 'active' : ''}`}
        >
            <div className="icon-container">{icon}</div>
            <span className="fw-medium">{label}</span>
        </Link>
    );
};

export default Navbar
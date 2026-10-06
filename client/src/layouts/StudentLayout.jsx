import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/student/Navbar';
import { useUser } from '../context/UserContext';

function StudentLayout() {
    const navigate = useNavigate();
    const { logout } = useUser();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div>
            <div className="bg-dark d-flex align-items-center justify-content-end px-5" style={{ minHeight: "10vh", minWidth: "100vw", position: "fixed", zIndex: "5" }}>
                <button className="btn btn-danger btn-sm px-3" onClick={handleLogout}>Logout</button>
            </div>
            <div className="bg-dark" style={{ minHeight: "10vh", minWidth: "100vw" }}></div>
            <div className="d-flex">
                <div style={{ height: "90vh", width: "15vw", position: "fixed" }}>
                    <Navbar />
                </div>
                <div style={{ height: "90vh", minWidth: "15vw" }}></div>
                <div style={{ minHeight: "90vh", minWidth: "85vw" }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default StudentLayout;

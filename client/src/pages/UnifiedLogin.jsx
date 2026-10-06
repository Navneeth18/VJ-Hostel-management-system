import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useAdmin } from '../context/AdminContext';
import backgroundImage from '../assets/1.jpg';

const UnifiedLogin = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Determine active role from location or query/hash or default to student
    const [role, setRole] = useState(() => {
        if (location.pathname.includes('admin')) return 'admin';
        return 'student';
    });

    const { login: studentLogin, user } = useUser();
    const { login: adminLogin, token: adminToken } = useAdmin();

    const { register: registerStudent, handleSubmit: handleSubmitStudent, formState: { errors: errorsStudent } } = useForm();
    const { register: registerAdmin, handleSubmit: handleSubmitAdmin, formState: { errors: errorsAdmin } } = useForm();

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/home', { replace: true });
        } else if (adminToken) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, adminToken, navigate]);

    const onStudentSubmit = async (data) => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.post('http://localhost:4000/student-api/login', data);
            studentLogin(response.data.student);
            localStorage.setItem('token', response.data.token);
            navigate('/home');
        } catch (err) {
            setError(err.response?.data?.message || 'Student login failed. Please check credentials.');
        } finally {
            setLoading(false);
        }
    };

    const onAdminSubmit = async (data) => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.post('http://localhost:4000/admin-api/login', data);
            adminLogin(response.data.admin, response.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Admin login failed. Please check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid text-light min-vh-100 d-flex align-items-center justify-content-center"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'relative'
            }}>
            {/* Dark overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                zIndex: 1
            }}></div>

            <div className="card bg-dark text-light p-4 shadow-lg"
                style={{
                    maxWidth: '420px',
                    width: '100%',
                    border: '1px solid #444',
                    borderRadius: '16px',
                    zIndex: 2,
                    backdropFilter: 'blur(8px)',
                    backgroundColor: 'rgba(33, 37, 41, 0.9)'
                }}>
                <div className="card-body">
                    <h1 className="text-center mb-1 fw-bold" style={{ color: '#8f94fb' }}>VNR VJIET</h1>
                    <h5 className="text-center text-muted mb-4">Hostel Management Portal</h5>

                    {/* Role Switcher Tabs */}
                    <div className="d-flex mb-4 p-1 bg-secondary rounded-3" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                        <button
                            type="button"
                            className={`btn flex-fill py-2 fw-semibold ${role === 'student' ? 'btn-primary shadow' : 'btn-link text-light text-decoration-none'}`}
                            onClick={() => { setRole('student'); setError(''); }}
                            style={role === 'student' ? { background: 'linear-gradient(to right, #4e54c8, #8f94fb)', border: 'none' } : {}}
                        >
                            <i className="bi bi-person-badge me-2"></i>Student Portal
                        </button>
                        <button
                            type="button"
                            className={`btn flex-fill py-2 fw-semibold ${role === 'admin' ? 'btn-primary shadow' : 'btn-link text-light text-decoration-none'}`}
                            onClick={() => { setRole('admin'); setError(''); }}
                            style={role === 'admin' ? { background: 'linear-gradient(to right, #4e54c8, #8f94fb)', border: 'none' } : {}}
                        >
                            <i className="bi bi-shield-lock me-2"></i>Admin Portal
                        </button>
                    </div>

                    {error && (
                        <div className="alert alert-danger py-2 mb-3 text-center" role="alert">
                            <small>{error}</small>
                        </div>
                    )}

                    {role === 'student' ? (
                        <form onSubmit={handleSubmitStudent(onStudentSubmit)}>
                            <div className="mb-3">
                                <label htmlFor="rollNumber" className="form-label small fw-semibold">Roll Number</label>
                                <input
                                    type="text"
                                    className={`form-control bg-dark text-light border-secondary ${errorsStudent.rollNumber ? 'is-invalid' : ''}`}
                                    id="rollNumber"
                                    placeholder="Enter your roll number"
                                    {...registerStudent('rollNumber', { required: 'Roll number is required' })}
                                />
                                {errorsStudent.rollNumber && (
                                    <div className="invalid-feedback">{errorsStudent.rollNumber.message}</div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="studentPassword" className="form-label small fw-semibold">Password</label>
                                <input
                                    type="password"
                                    className={`form-control bg-dark text-light border-secondary ${errorsStudent.password ? 'is-invalid' : ''}`}
                                    id="studentPassword"
                                    placeholder="Enter your password"
                                    {...registerStudent('password', { required: 'Password is required' })}
                                />
                                {errorsStudent.password && (
                                    <div className="invalid-feedback">{errorsStudent.password.message}</div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100 py-2 fw-bold"
                                style={{
                                    background: 'linear-gradient(to right, #4e54c8, #8f94fb)',
                                    border: 'none',
                                    borderRadius: '8px'
                                }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Logging in...
                                    </>
                                ) : 'Student Login'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmitAdmin(onAdminSubmit)}>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label small fw-semibold">Username</label>
                                <input
                                    type="text"
                                    className={`form-control bg-dark text-light border-secondary ${errorsAdmin.username ? 'is-invalid' : ''}`}
                                    id="username"
                                    placeholder="Enter admin username"
                                    {...registerAdmin('username', { required: 'Username is required' })}
                                />
                                {errorsAdmin.username && (
                                    <div className="invalid-feedback">{errorsAdmin.username.message}</div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="adminPassword" className="form-label small fw-semibold">Password</label>
                                <input
                                    type="password"
                                    className={`form-control bg-dark text-light border-secondary ${errorsAdmin.password ? 'is-invalid' : ''}`}
                                    id="adminPassword"
                                    placeholder="Enter admin password"
                                    {...registerAdmin('password', { required: 'Password is required' })}
                                />
                                {errorsAdmin.password && (
                                    <div className="invalid-feedback">{errorsAdmin.password.message}</div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100 py-2 fw-bold"
                                style={{
                                    background: 'linear-gradient(to right, #4e54c8, #8f94fb)',
                                    border: 'none',
                                    borderRadius: '8px'
                                }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Logging in...
                                    </>
                                ) : 'Admin Login'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UnifiedLogin;

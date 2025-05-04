import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';
import backgroundImage from '../assets/1.jpg';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAdmin();

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.post('http://localhost:4000/admin-api/login', data);
            login(response.data.admin, response.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
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
            {/* Overlay to darken the background image */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                zIndex: 1
            }}></div>

            <div className="card bg-dark text-light p-4 shadow"
                style={{
                    maxWidth: '400px',
                    width: '100%',
                    border: '1px solid #444',
                    zIndex: 2,
                    backdropFilter: 'blur(5px)',
                    backgroundColor: 'rgba(33, 37, 41, 0.85)'
                }}>
                <div className="card-body">
                    <h1 className="text-center mb-2" style={{ color: '#8f94fb', fontWeight: 'bold' }}>VNR VJIET</h1>
                    <h2 className="text-center mb-4">Hostel Admin Portal</h2>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                type="text"
                                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                id="username"
                                {...register('username', { required: 'Username is required' })}
                            />
                            {errors.username && (
                                <div className="invalid-feedback">
                                    {errors.username.message}
                                </div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                id="password"
                                {...register('password', { required: 'Password is required' })}
                            />
                            {errors.password && (
                                <div className="invalid-feedback">
                                    {errors.password.message}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            style={{
                                background: 'linear-gradient(to right, #4e54c8, #8f94fb)',
                                border: 'none',
                                padding: '10px',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
                                transition: 'all 0.2s ease'
                            }}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Logging in...
                                </>
                            ) : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;

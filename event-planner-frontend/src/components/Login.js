import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email: email,
                password: password
            });

            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            console.log('Login successful! Token:', token);
            console.log('User type:', user.role);

            navigate('/events');

        } catch (err) {
            console.error('Login error:', err.response?.data);
            setError('Email or password incorrect. Please try again.');
        }
    };

    const handleButtonClick = (e) => {
        e.preventDefault();
        handleSubmit(e);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100 flex items-center justify-center p-8">
            <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12">
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 text-stone-600 hover:text-stone-800 flex items-center"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </button>

                <h2 className="text-3xl font-serif text-amber-800 mb-8 text-center">Log in to Your Account</h2>

                <div className="space-y-6">
                    <div>
                        <label className="block text-stone-700 mb-2 font-medium">E-mail:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSubmit(e);
                                }
                            }}
                            className="w-full px-4 py-3 bg-amber-100/50 border-none rounded-xl focus:ring-2 focus:ring-amber-300 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-stone-700 mb-2 font-medium">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSubmit(e);
                                }
                            }}
                            className="w-full px-4 py-3 bg-amber-100/50 border-none rounded-xl focus:ring-2 focus:ring-amber-300 outline-none"
                            required
                        />
                    </div>

                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    <button
                        onClick={handleButtonClick}
                        type="button"
                        className="w-full bg-stone-500 hover:bg-stone-600 text-white py-4 rounded-2xl font-medium transition-all duration-300 shadow-lg"
                    >
                        Log in
                    </button>
                </div>

                <p className="text-center mt-6 text-stone-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-amber-700 hover:text-amber-800 font-medium">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
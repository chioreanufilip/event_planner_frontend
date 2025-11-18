import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [accountType, setAccountType] = useState('participant');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        let registrationUrl = '';
        let payload = { name, email, password };

        if (accountType === 'participant') {
            registrationUrl = 'http://localhost:8080/api/auth/register/participant';
        } else {
            registrationUrl = 'http://localhost:8080/api/auth/register/organizer';
        }

        try {
            const response = await axios.post(registrationUrl, payload);
            console.log('Account created:', response.data);
            setSuccess('Account created successfully! Redirecting...');

            const loginResponse = await axios.post('http://localhost:8080/api/auth/login', {
                email: email,
                password: password
            });

            const { token, user } = loginResponse.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setTimeout(() => {
                navigate('/home');
            }, 1000);

        } catch (err) {
            console.error('Registration error:', err.response?.data);
            setError('Registration error. Email might already be in use.');
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

                <h2 className="text-3xl font-serif text-amber-800 mb-8 text-center">Create Your Account</h2>

                <div className="space-y-5">
                    <div>
                        <label className="block text-stone-700 mb-2 font-medium">Select Role:</label>
                        <select
                            value={accountType}
                            onChange={(e) => {
                                setAccountType(e.target.value);
                                setError('');
                                setSuccess('');
                            }}
                            className="w-full px-4 py-3 bg-amber-100/50 border-none rounded-xl focus:ring-2 focus:ring-amber-300 outline-none"
                        >
                            <option value="participant">Participant</option>
                            <option value="organizer">Organizer</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-stone-700 mb-2 font-medium">Full name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 bg-amber-100/50 border-none rounded-xl focus:ring-2 focus:ring-amber-300 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-stone-700 mb-2 font-medium">E-mail address:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            className="w-full px-4 py-3 bg-amber-100/50 border-none rounded-xl focus:ring-2 focus:ring-amber-300 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-stone-700 mb-2 font-medium">Confirm Password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                    {success && <p className="text-green-600 text-sm">{success}</p>}

                    <button
                        onClick={handleButtonClick}
                        type="button"
                        className="w-full bg-stone-500 hover:bg-stone-600 text-white py-4 rounded-2xl font-medium transition-all duration-300 shadow-lg"
                    >
                        Register
                    </button>
                </div>

                <p className="text-center mt-6 text-stone-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-amber-700 hover:text-amber-800 font-medium">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
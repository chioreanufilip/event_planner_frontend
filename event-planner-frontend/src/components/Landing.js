import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100 flex items-center justify-center p-8">
            <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 text-center">
                <h1 className="text-4xl font-serif text-amber-800 mb-4">Wedding Manager</h1>
                <p className="text-stone-600 mb-12 font-light italic">
                    Easily manage your wedding events, invitations, and photos in one place
                </p>

                <div className="space-y-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-stone-400 hover:bg-stone-500 text-white py-4 rounded-2xl font-medium transition-all duration-300 shadow-lg"
                    >
                        Log in
                    </button>

                    <button
                        onClick={() => navigate('/register')}
                        className="w-full bg-stone-400 hover:bg-stone-500 text-white py-4 rounded-2xl font-medium transition-all duration-300 shadow-lg"
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Landing;
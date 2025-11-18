import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../api';

const CreateEvent = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [budget, setBudget] = useState('');
    const [size, setSize] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const eventData = {
            name,
            location,
            date: date ? `${date}T00:00:00` : null,
            budget: parseFloat(budget) || 0,
            size: parseInt(size) || 0
        };

        try {
            const response = await api.post('/api/event/create', eventData);
            setSuccess(`Event "${response.data.name}" created successfully!`);

            setTimeout(() => {
                navigate(`/event/${response.data.id}`);
            }, 1000);

        } catch (err) {
            console.error('Error creating event:', err);
            if (err.response?.status === 403) {
                setError('Error. You do not have permission.');
            } else {
                setError('An error occurred while creating the event. Please try again.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100 flex items-center justify-center p-8">
            <div className="max-w-2xl w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12">
                <button
                    onClick={() => navigate('/events')}
                    className="mb-6 text-stone-600 hover:text-stone-800 flex items-center"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Events
                </button>

                <h2 className="text-3xl font-serif text-amber-800 mb-8 text-center">Create New Event</h2>

                <div className="space-y-6">
                    <div>
                        <label className="block text-stone-700 mb-2 font-medium">Event Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 bg-amber-100/50 border-none rounded-xl focus:ring-2 focus:ring-amber-300 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-stone-700 mb-2 font-medium">Location:</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-4 py-3 bg-amber-100/50 border-none rounded-xl focus:ring-2 focus:ring-amber-300 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-stone-700 mb-2 font-medium">Date:</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-4 py-3 bg-amber-100/50 border-none rounded-xl focus:ring-2 focus:ring-amber-300 outline-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-stone-700 mb-2 font-medium">Budget ($):</label>
                            <input
                                type="number"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                className="w-full px-4 py-3 bg-amber-100/50 border-none rounded-xl focus:ring-2 focus:ring-amber-300 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-stone-700 mb-2 font-medium">Guest Count:</label>
                            <input
                                type="number"
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                                className="w-full px-4 py-3 bg-amber-100/50 border-none rounded-xl focus:ring-2 focus:ring-amber-300 outline-none"
                                required
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    {success && <p className="text-green-600 text-sm">{success}</p>}

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-2xl font-medium transition-all duration-300 shadow-lg"
                    >
                        Create Event
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateEvent;
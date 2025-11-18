import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import api from '../api';

const Events = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }

        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/api/event/my-events');
            setEvents(response.data);
        } catch (err) {
            console.error('Error fetching events:', err);
            setError('Could not load events.');
        }
        setIsLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100">
            <div className="container mx-auto px-8 py-12">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-serif text-amber-800 mb-2">Your Events</h1>
                        <p className="text-stone-600">Welcome back, {user?.name}!</p>
                    </div>
                    <div className="flex gap-4">
                        {user?.role === 'organizer' && (
                            <button
                                onClick={() => navigate('/event/create')}
                                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg flex items-center gap-2"
                            >
                                Create Event
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        )}
                        <button
                            onClick={handleLogout}
                            className="bg-stone-400 hover:bg-stone-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-20">
                        <p className="text-stone-600 text-xl">Loading events...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-600 text-xl">{error}</p>
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20">
                        <Calendar className="w-20 h-20 text-stone-300 mx-auto mb-4" />
                        <h3 className="text-2xl text-stone-600 mb-2">No events yet</h3>
                        <p className="text-stone-500 mb-6">Create your first event to get started</p>
                        {user?.role === 'organizer' && (
                            <button
                                onClick={() => navigate('/event/create')}
                                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 shadow-lg"
                            >
                                Create Your First Event
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
                                onClick={() => navigate(`/event/${event.id}`)}
                            >
                                <div className="bg-gradient-to-br from-amber-400 to-amber-600 h-32"></div>
                                <div className="p-6">
                                    <h3 className="text-2xl font-serif text-amber-800 mb-4">{event.name}</h3>

                                    <div className="space-y-2 text-stone-600">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>{event.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>{event.date ? new Date(event.date).toLocaleDateString() : 'No date'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            <span>{event.size} guests</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4" />
                                            <span>${event.budget}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;
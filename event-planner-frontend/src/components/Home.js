import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Image, Users, Plus, ArrowRight } from 'lucide-react';
import api from '../api';

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        totalEvents: 0,
        totalMedia: 0,
        totalInvitations: 0
    });
    const [recentEvents, setRecentEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const userRole = JSON.parse(localStorage.getItem('user'))?.role;

            if (userRole === 'organizer') {
                const eventsResponse = await api.get('/api/event/my-events');
                const events = eventsResponse.data;

                setStats({
                    totalEvents: events.length,
                    totalMedia: 0,
                    totalInvitations: 0
                });

                setRecentEvents(events.slice(0, 3));
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100">
            <div className="container mx-auto px-8 py-12">
                <div className="mb-12">
                    <h1 className="text-5xl font-serif text-amber-800 mb-3">
                        Welcome back, {user?.name}!
                    </h1>
                    <p className="text-xl text-stone-600">
                        {user?.role === 'organizer'
                            ? 'Manage your events, invitations, and media all in one place'
                            : 'View your event invitations and uploaded memories'
                        }
                    </p>
                </div>

                {user?.role === 'organizer' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-amber-100 p-3 rounded-xl">
                                    <Calendar className="w-8 h-8 text-amber-600" />
                                </div>
                                <span className="text-4xl font-bold text-amber-800">{stats.totalEvents}</span>
                            </div>
                            <h3 className="text-stone-600 font-medium">Total Events</h3>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-amber-100 p-3 rounded-xl">
                                    <Image className="w-8 h-8 text-amber-600" />
                                </div>
                                <span className="text-4xl font-bold text-amber-800">{stats.totalMedia}</span>
                            </div>
                            <h3 className="text-stone-600 font-medium">Media Files</h3>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-amber-100 p-3 rounded-xl">
                                    <Users className="w-8 h-8 text-amber-600" />
                                </div>
                                <span className="text-4xl font-bold text-amber-800">{stats.totalInvitations}</span>
                            </div>
                            <h3 className="text-stone-600 font-medium">Invitations Sent</h3>
                        </div>
                    </div>
                )}

                <div className="mb-12">
                    <h2 className="text-3xl font-serif text-amber-800 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {user?.role === 'organizer' && (
                            <>
                                <button
                                    onClick={() => navigate('/event/create')}
                                    className="bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105"
                                >
                                    <Plus className="w-12 h-12 mb-4 mx-auto" />
                                    <h3 className="text-xl font-semibold mb-2">Create New Event</h3>
                                    <p className="text-amber-100">Start planning your next wedding</p>
                                </button>

                                <button
                                    onClick={() => navigate('/events')}
                                    className="bg-white/80 backdrop-blur-sm hover:bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105"
                                >
                                    <Calendar className="w-12 h-12 mb-4 mx-auto text-amber-600" />
                                    <h3 className="text-xl font-semibold text-stone-800 mb-2">View All Events</h3>
                                    <p className="text-stone-600">Browse and manage your events</p>
                                </button>

                                {/*<button*/}
                                {/*    onClick={() => navigate('/events')}*/}
                                {/*    className="bg-white/80 backdrop-blur-sm hover:bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105"*/}
                                {/*>*/}
                                {/*    <Users className="w-12 h-12 mb-4 mx-auto text-amber-600" />*/}
                                {/*    <h3 className="text-xl font-semibold text-stone-800 mb-2">Manage Invitations</h3>*/}
                                {/*    <p className="text-stone-600">Send and track guest responses</p>*/}
                                {/*</button>*/}
                            </>
                        )}

                        {user?.role === 'participant' && (
                            <>
                                <button
                                    onClick={() => navigate('/events')}
                                    className="bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105"
                                >
                                    <Calendar className="w-12 h-12 mb-4 mx-auto" />
                                    <h3 className="text-xl font-semibold mb-2">My Invitations</h3>
                                    <p className="text-amber-100">View events you're invited to</p>
                                </button>

                                <button
                                    onClick={() => navigate('/events')}
                                    className="bg-white/80 backdrop-blur-sm hover:bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105"
                                >
                                    <Image className="w-12 h-12 mb-4 mx-auto text-amber-600" />
                                    <h3 className="text-xl font-semibold text-stone-800 mb-2">Event Photos</h3>
                                    <p className="text-stone-600">Browse and upload memories</p>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {user?.role === 'organizer' && recentEvents.length > 0 && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-serif text-amber-800">Recent Events</h2>
                            <button
                                onClick={() => navigate('/events')}
                                className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-2"
                            >
                                View All
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {recentEvents.map((event) => (
                                <div
                                    key={event.id}
                                    onClick={() => navigate(`/media/event/${event.id}`)}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                                >
                                    <div className="bg-gradient-to-br from-amber-400 to-amber-600 h-32 group-hover:from-amber-500 group-hover:to-amber-700 transition-all"></div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-serif text-amber-800 mb-2 group-hover:text-amber-900">
                                            {event.name}
                                        </h3>
                                        <p className="text-stone-600 text-sm mb-4">{event.location}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-stone-500 text-sm">
                                                {event.date ? new Date(event.date).toLocaleDateString() : 'No date'}
                                            </span>
                                            <span className="text-amber-600 font-medium text-sm group-hover:underline">
                                                View Details →
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!isLoading && ((user?.role === 'organizer' && recentEvents.length === 0) || user?.role === 'participant') && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center">
                        <Calendar className="w-20 h-20 text-stone-300 mx-auto mb-4" />
                        <h3 className="text-2xl font-serif text-stone-600 mb-2">
                            {user?.role === 'organizer' ? 'No Events Yet' : 'No Invitations Yet'}
                        </h3>
                        <p className="text-stone-500 mb-6">
                            {user?.role === 'organizer'
                                ? 'Create your first event to get started with planning'
                                : 'You will see your event invitations here once you receive them'
                            }
                        </p>
                        {user?.role === 'organizer' && (
                            <button
                                onClick={() => navigate('/event/create')}
                                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg"
                            >
                                Create Your First Event
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
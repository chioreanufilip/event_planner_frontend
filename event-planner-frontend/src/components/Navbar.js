import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Home, Calendar, LogOut, ChevronDown, Image, Users } from 'lucide-react';
import api from '../api';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [showEventsDropdown, setShowEventsDropdown] = useState(false);
    const [showInvitationsDropdown, setShowInvitationsDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const invitationsDropdownRef = useRef(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
            fetchEvents();
        } else {
            setUser(null);
        }
    }, [location]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowEventsDropdown(false);
            }
            if (invitationsDropdownRef.current && !invitationsDropdownRef.current.contains(event.target)) {
                setShowInvitationsDropdown(false);
            }
            if (!dropdownRef.current?.contains(event.target) && !invitationsDropdownRef.current?.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchEvents = async () => {
        try {
            if (JSON.parse(localStorage.getItem('user'))?.role === 'organizer') {
                const response = await api.get('/api/event/my-events');
                setEvents(response.data);
            }
        } catch (err) {
            console.error('Error fetching events:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
        setIsOpen(false);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsOpen(false);
        setShowEventsDropdown(false);
        setShowInvitationsDropdown(false);
    };

    if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') {
        return null;
    }

    if (!user) {
        return null;
    }

    return (
        <nav className="bg-white/80 backdrop-blur-sm shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-8">
                <div className="flex justify-between items-center h-16">
                    <div
                        className="text-2xl font-serif text-amber-800 cursor-pointer hover:text-amber-900 transition-colors"
                        onClick={() => handleNavigation('/home')}
                    >
                        Wedding Manager
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <button
                            onClick={() => handleNavigation('/home')}
                            className="flex items-center gap-2 text-stone-700 hover:text-amber-800 transition-colors font-medium"
                        >
                            <Home className="w-5 h-5" />
                            Home
                        </button>

                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => {
                                    setShowEventsDropdown(!showEventsDropdown);
                                    setShowInvitationsDropdown(false);
                                }}
                                className="flex items-center gap-2 text-stone-700 hover:text-amber-800 transition-colors font-medium"
                            >
                                <Calendar className="w-5 h-5" />
                                Events
                                <ChevronDown className={`w-4 h-4 transition-transform ${showEventsDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {showEventsDropdown && events.length > 0 && (
                                <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-2xl py-2 min-w-[250px] max-h-[400px] overflow-y-auto z-50">
                                    {events.map((event) => (
                                        <button
                                            key={event.id}
                                            onClick={() => handleNavigation(`/media/event/${event.id}`)}
                                            className="w-full px-4 py-3 text-left hover:bg-amber-50 transition-colors flex items-center gap-3 group"
                                        >
                                            <Image className="w-4 h-4 text-amber-600" />
                                            <div>
                                                <div className="text-stone-800 font-medium group-hover:text-amber-800">
                                                    {event.name}
                                                </div>
                                                <div className="text-xs text-stone-500">
                                                    {event.location}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {user?.role === 'organizer' && (
                            <div className="relative" ref={invitationsDropdownRef}>
                                <button
                                    onClick={() => {
                                        setShowInvitationsDropdown(!showInvitationsDropdown);
                                        setShowEventsDropdown(false);
                                    }}
                                    className="flex items-center gap-2 text-stone-700 hover:text-amber-800 transition-colors font-medium"
                                >
                                    <Users className="w-5 h-5" />
                                    Invitations
                                    <ChevronDown className={`w-4 h-4 transition-transform ${showInvitationsDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {showInvitationsDropdown && events.length > 0 && (
                                    <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-2xl py-2 min-w-[250px] max-h-[400px] overflow-y-auto z-50">
                                        {events.map((event) => (
                                            <button
                                                key={event.id}
                                                onClick={() => handleNavigation(`/event/${event.id}/invitations`)}
                                                className="w-full px-4 py-3 text-left hover:bg-amber-50 transition-colors flex items-center gap-3 group"
                                            >
                                                <Users className="w-4 h-4 text-amber-600" />
                                                <div>
                                                    <div className="text-stone-800 font-medium group-hover:text-amber-800">
                                                        {event.name}
                                                    </div>
                                                    <div className="text-xs text-stone-500">
                                                        Manage invitations
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="h-6 w-px bg-stone-300"></div>

                        <div className="flex items-center gap-3">
                            <span className="text-stone-600">Welcome, {user?.name}</span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-stone-400 hover:bg-stone-500 text-white px-4 py-2 rounded-lg transition-all duration-300"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-stone-700 hover:text-amber-800 transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                {isOpen && (
                    <div className="md:hidden py-4 border-t border-stone-200">
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => handleNavigation('/home')}
                                className="flex items-center gap-2 text-stone-700 hover:text-amber-800 transition-colors font-medium px-4 py-3 rounded-lg hover:bg-amber-50"
                            >
                                <Home className="w-5 h-5" />
                                Home
                            </button>

                            <div className="px-4 py-2">
                                <div className="flex items-center gap-2 text-stone-700 font-medium mb-2">
                                    <Calendar className="w-5 h-5" />
                                    Events
                                </div>
                                <div className="pl-7 space-y-1">
                                    {events.map((event) => (
                                        <button
                                            key={event.id}
                                            onClick={() => handleNavigation(`/media/event/${event.id}`)}
                                            className="w-full text-left text-stone-600 hover:text-amber-800 py-2 text-sm"
                                        >
                                            {event.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {user?.role === 'organizer' && (
                                <div className="px-4 py-2">
                                    <div className="flex items-center gap-2 text-stone-700 font-medium mb-2">
                                        <Users className="w-5 h-5" />
                                        Invitations
                                    </div>
                                    <div className="pl-7 space-y-1">
                                        {events.map((event) => (
                                            <button
                                                key={event.id}
                                                onClick={() => handleNavigation(`/event/${event.id}/invitations`)}
                                                className="w-full text-left text-stone-600 hover:text-amber-800 py-2 text-sm"
                                            >
                                                {event.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="border-t border-stone-200 mt-2 pt-2">
                                <div className="px-4 py-2 text-stone-600 text-sm">
                                    Welcome, {user?.name}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors font-medium px-4 py-3 rounded-lg hover:bg-red-50 w-full"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
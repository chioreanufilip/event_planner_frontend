import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, UserPlus, Check, X, Clock, Search, Trash2 } from 'lucide-react';
import api from '../api';

const Invitations = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [event, setEvent] = useState(null);
    const [invitations, setInvitations] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [selectedParticipant, setSelectedParticipant] = useState('');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        if (eventId) {
            fetchEventDetails();
            fetchInvitations();
            fetchParticipants();
        }
    }, [eventId]);

    const fetchEventDetails = async () => {
        try {
            const response = await api.get(`/api/event/${eventId}`);
            setEvent(response.data);
        } catch (err) {
            console.error('Error fetching event:', err);
            setError('Could not load event details.');
        }
    };

    const fetchInvitations = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/api/invitations/event/${eventId}`);
            setInvitations(response.data);
        } catch (err) {
            console.error('Error fetching invitations:', err);
            setError('Could not load invitations.');
        }
        setIsLoading(false);
    };

    const fetchParticipants = async () => {
        try {
            const response = await api.get('/api/participants/all');
            setParticipants(response.data);
        } catch (err) {
            console.error('Error fetching participants:', err);
        }
    };

    const handleSendInvitation = async () => {
        if (!selectedParticipant) {
            setError('Please select a participant.');
            return;
        }

        setError('');
        setSuccess('');

        try {
            await api.post(`/api/invitations/event/${eventId}/participant/${selectedParticipant}`);
            setSuccess('Invitation sent successfully!');
            setSelectedParticipant('');
            setSearchEmail('');
            fetchInvitations();
        } catch (err) {
            console.error('Error sending invitation:', err);
            setError(err.response?.data?.message || 'Failed to send invitation. The participant might already be invited.');
        }
    };

    const handleDeleteInvitation = async (invitationId) => {
        if (window.confirm('Are you sure you want to delete this invitation?')) {
            try {
                await api.delete(`/api/invitations/${invitationId}`);
                setSuccess('Invitation deleted successfully!');
                fetchInvitations();
            } catch (err) {
                console.error('Error deleting invitation:', err);
                setError('Failed to delete invitation.');
            }
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'GOING':
                return <Check className="w-5 h-5 text-green-600" />;
            case 'NOT_GOING':
                return <X className="w-5 h-5 text-red-600" />;
            default:
                return <Clock className="w-5 h-5 text-stone-400" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'GOING':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'NOT_GOING':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-stone-100 text-stone-800 border-stone-300';
        }
    };

    const filteredParticipants = participants.filter(p =>
        p.email.toLowerCase().includes(searchEmail.toLowerCase()) ||
        p.name.toLowerCase().includes(searchEmail.toLowerCase())
    );

    const stats = {
        total: invitations.length,
        going: invitations.filter(i => i.rsvpStatus === 'GOING').length,
        notGoing: invitations.filter(i => i.rsvpStatus === 'NOT_GOING').length,
    };

    if (!event) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100 flex items-center justify-center">
                <p className="text-stone-600 text-xl">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100">
            <div className="container mx-auto px-8 py-12">
                <button
                    onClick={() => navigate('/events')}
                    className="mb-6 text-stone-600 hover:text-stone-800 flex items-center transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Events
                </button>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <Mail className="w-8 h-8 text-amber-600" />
                        <h1 className="text-4xl font-serif text-amber-800">Invitations</h1>
                    </div>
                    <p className="text-xl text-stone-600">For: {event.name}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                        <div className="text-3xl font-bold text-amber-800 mb-1">{stats.total}</div>
                        <div className="text-stone-600 text-sm">Total Invited</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                        <div className="text-3xl font-bold text-green-600 mb-1">{stats.going}</div>
                        <div className="text-stone-600 text-sm">Attending</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                        <div className="text-3xl font-bold text-red-600 mb-1">{stats.notGoing}</div>
                        <div className="text-stone-600 text-sm">Declined</div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8">
                    <h2 className="text-2xl font-serif text-amber-800 mb-6 flex items-center gap-2">
                        <UserPlus className="w-6 h-6" />
                        Send New Invitation
                    </h2>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-stone-700 mb-2 font-medium">Search Participant</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchEmail}
                                    onChange={(e) => setSearchEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-amber-100/50 border-none rounded-xl focus:ring-2 focus:ring-amber-300 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex-1">
                            <label className="block text-stone-700 mb-2 font-medium">Select Participant</label>
                            <select
                                value={selectedParticipant}
                                onChange={(e) => setSelectedParticipant(e.target.value)}
                                className="w-full px-4 py-3 bg-amber-100/50 border-none rounded-xl focus:ring-2 focus:ring-amber-300 outline-none"
                            >
                                <option value="">Choose a participant...</option>
                                {filteredParticipants.map((participant) => (
                                    <option key={participant.id} value={participant.id}>
                                        {participant.name} ({participant.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={handleSendInvitation}
                                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg flex items-center gap-2 whitespace-nowrap"
                            >
                                <Mail className="w-5 h-5" />
                                Send Invitation
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm">
                            {success}
                        </div>
                    )}
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
                    <h2 className="text-2xl font-serif text-amber-800 mb-6">Guest List</h2>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent mx-auto mb-4"></div>
                            <p className="text-stone-500">Loading invitations...</p>
                        </div>
                    ) : invitations.length === 0 ? (
                        <div className="text-center py-12">
                            <Mail className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                            <p className="text-stone-500 text-lg">No invitations sent yet</p>
                            <p className="text-stone-400 text-sm mt-2">Send your first invitation to get started</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {invitations.map((invitation) => (
                                <div
                                    key={invitation.id}
                                    className="flex items-center justify-between p-6 bg-stone-50 rounded-2xl hover:bg-stone-100 transition-colors"
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="bg-amber-100 p-3 rounded-full">
                                            {getStatusIcon(invitation.rsvpStatus)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-stone-800">
                                                {invitation.participant?.name || 'Unknown'}
                                            </h3>
                                            <p className="text-stone-600 text-sm">
                                                {invitation.participant?.email || 'No email'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className={`px-4 py-2 rounded-lg text-sm font-medium border ${getStatusColor(invitation.rsvpStatus)}`}>
                                            {invitation.rsvpStatus || 'PENDING'}
                                        </span>
                                        <button
                                            onClick={() => handleDeleteInvitation(invitation.id)}
                                            className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Invitations;
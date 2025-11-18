import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, DollarSign, Image, Upload, Trash2 } from 'lucide-react';
import axios from 'axios';
import api from '../api';

const CLOUDINARY_CLOUD_NAME = "dkjswcite";
const CLOUDINARY_UPLOAD_PRESET = "event_planner_preset";

const EventGallery = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [mediaList, setMediaList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchEventDetails();
        fetchMedia();
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

    const fetchMedia = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/api/media/event/${eventId}`);
            setMediaList(response.data);
        } catch (err) {
            console.error('Error loading media:', err);
            setError('Could not load gallery.');
        }
        setIsLoading(false);
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setError('');
        setSuccess('');
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please choose a file.');
            return;
        }

        setIsUploading(true);
        setError('');
        setSuccess('');

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

            const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;
            const cloudResponse = await axios.post(cloudinaryUrl, formData);

            const { secure_url, resource_type } = cloudResponse.data;

            const mediaType = resource_type === 'image' ? 'PHOTO' : 'VIDEO';
            const mediaData = {
                url: secure_url,
                mediaType: mediaType
            };

            await api.post(`/api/media/event/${eventId}`, mediaData);

            setSuccess('File uploaded successfully!');
            setSelectedFile(null);
            document.querySelector('input[type="file"]').value = '';
            fetchMedia();

        } catch (err) {
            console.error('Upload error:', err);
            setError('Upload failed, please try again.');
        }
        setIsUploading(false);
    };

    const handleDelete = async (mediaId) => {
        if (window.confirm('Are you sure you want to delete this?')) {
            try {
                await api.delete(`/api/media/${mediaId}`);
                setSuccess('File deleted successfully!');
                fetchMedia();
            } catch (err) {
                console.error('Deletion error:', err);
                setError('Delete failed. Do you have permission?');
            }
        }
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

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 mb-8">
                    <h1 className="text-4xl font-serif text-amber-800 mb-6">{event.name}</h1>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-stone-700">
                        <div className="flex items-center gap-3">
                            <MapPin className="w-6 h-6 text-amber-600" />
                            <div>
                                <p className="text-sm text-stone-500">Location</p>
                                <p className="font-medium">{event.location}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Calendar className="w-6 h-6 text-amber-600" />
                            <div>
                                <p className="text-sm text-stone-500">Date</p>
                                <p className="font-medium">
                                    {event.date ? new Date(event.date).toLocaleDateString() : 'No date'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Users className="w-6 h-6 text-amber-600" />
                            <div>
                                <p className="text-sm text-stone-500">Guests</p>
                                <p className="font-medium">{event.size} people</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <DollarSign className="w-6 h-6 text-amber-600" />
                            <div>
                                <p className="text-sm text-stone-500">Budget</p>
                                <p className="font-medium">${event.budget}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12">
                    <h2 className="text-2xl font-serif text-amber-800 mb-6">Media Gallery</h2>

                    <div className="mb-8 p-6 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl border border-amber-200">
                        <h3 className="text-lg font-medium text-amber-900 mb-4 flex items-center gap-2">
                            <Upload className="w-5 h-5" />
                            Upload Photo or Video
                        </h3>
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 w-full">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*,video/*"
                                    className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-600 file:text-white file:cursor-pointer hover:file:bg-amber-700 transition-all"
                                />
                            </div>
                            <button
                                onClick={handleUpload}
                                disabled={isUploading || !selectedFile}
                                className="bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg flex items-center gap-2 whitespace-nowrap"
                            >
                                {isUploading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        Upload
                                    </>
                                )}
                            </button>
                        </div>
                        {error && (
                            <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm">
                                {success}
                            </div>
                        )}
                    </div>

                    {/* Gallery Grid */}
                    <div className="border-t border-stone-200 pt-8">
                        {isLoading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent mx-auto mb-4"></div>
                                <p className="text-stone-500">Loading media...</p>
                            </div>
                        ) : mediaList.length === 0 ? (
                            <div className="text-center py-12">
                                <Image className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                                <p className="text-stone-500 text-lg">No media uploaded yet</p>
                                <p className="text-stone-400 text-sm mt-2">Upload your first photo or video to get started</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-medium text-stone-700">
                                        Uploaded Files ({mediaList.length})
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {mediaList.map((media) => (
                                        <div
                                            key={media.id}
                                            className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white"
                                        >
                                            {media.mediaType === 'PHOTO' ? (
                                                <img
                                                    src={media.url}
                                                    alt="Event media"
                                                    className="w-full h-64 object-cover"
                                                />
                                            ) : (
                                                <video
                                                    src={media.url}
                                                    controls
                                                    className="w-full h-64 object-cover bg-black"
                                                />
                                            )}
                                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleDelete(media.id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-lg transition-colors flex items-center gap-2"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </button>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-white text-sm font-medium">
                                                    {media.mediaType === 'PHOTO' ? '📷 Photo' : '🎥 Video'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventGallery;
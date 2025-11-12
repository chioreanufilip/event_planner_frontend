import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ai nevoie de axios normal pentru Cloudinary
import api from '../api'; // Și de 'api' al tău pentru backend

// --- CONFIGUREAZĂ ASTA! ---
const CLOUDINARY_CLOUD_NAME = "dkjswcite"; // Pune aici Cloud Name-ul tău
const CLOUDINARY_UPLOAD_PRESET = "event_planner_preset"; // Pune aici numele Presei tale Unsigned
// --------------------------

const EventGallery = () => {
    // 1. Ia ID-ul evenimentului din URL (ex. /events/5/gallery -> eventId = 5)
    const { eventId } = useParams();
    // console.log("Media ID:", mediaId);
    const navigate = useNavigate();
    const [success, setSuccess] = useState('');

    // 2. State-uri
    const [mediaList, setMediaList] = useState([]); // Lista de poze/video
    const [selectedFile, setSelectedFile] = useState(null); // Fișierul selectat pt upload
    // const [description, setDescription] = useState('');
    
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    // 3. Funcție pentru a încărca media din backend
    const fetchMedia = async () => {
        setIsLoading(true);
        try {
            // Folosim 'api' (cu token) pentru a cere media de la backend
            const response = await api.get(`/api/media/event/${eventId}`);
            setMediaList(response.data);
        } catch (err) {
            console.error("Eroare la încărcarea mediei:", err);
            setError("Nu am putut încărca galeria.");
        }
        setIsLoading(false);
    };

    // 4. Se apelează o singură dată când se încarcă pagina
    useEffect(() => {
        fetchMedia();
    }, [eventId]); // Se reîncarcă dacă 'eventId' se schimbă

    // 5. Se apelează când utilizatorul alege un fișier
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // 6. --- FLUXUL DE UPLOAD (cel mai important) ---
    const handleUpload = async () => {
        if (!selectedFile) {
            setError("Choose file.");
            return;
        }
        
        setIsUploading(true);
        setError('');

        try {
            // --- Partea 1: Upload direct la Cloudinary ---
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

            // Folosim 'axios' normal (nu 'api') pentru că nu trimitem token-ul nostru
            const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;
            const cloudResponse = await axios.post(cloudinaryUrl, formData);

            const { secure_url, resource_type } = cloudResponse.data;

            // --- Partea 2: Salvează URL-ul în backend-ul tău ---
            const mediaType = resource_type === 'image' ? 'PHOTO' : 'VIDEO';
            
            const mediaData = {
                url: secure_url,
                // description: description,
                mediaType: mediaType
            };

            // Folosim 'api' (cu token) pentru a salva în DB-ul nostru
            await api.post(`/api/media/event/${eventId}`, mediaData);

            // --- Partea 3: Curățare ---
            setSuccess("Fișier încărcat cu succes!");
            setSelectedFile(null);
            // setDescription('');
            fetchMedia(); // Reîncarcă galeria ca să apară noul fișier

        } catch (err) {
            console.error("Eroare la upload:", err);
            setError("Upload failed, please try again.");
        }
        setIsUploading(false);
    };
    
    // 7. Funcția de ștergere
    const handleDelete = async (mediaId) => {
        if (window.confirm("Are you sure you want to delete ?")) {
            try {console.log("Deleting media ID:", mediaId);
                // 'api.delete' va trimite automat token-ul
                await api.delete(`api/media/${mediaId}`);
                // Reîncarcă galeria
                setSelectedFile()
                fetchMedia(); 
            } catch (err) {
                console.error("Deletion error:", err);
                setError("Delete failed, no permission?");
            }
        }
    };


    // 8. Afișarea (JSX)
    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
            <h2>Event Galary (ID: {eventId})</h2>
            
            {/* --- Secțiunea de Upload --- */}
            <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
                <h3>Upload a video or a photo or something</h3>
                <input type="file" onChange={handleFileChange} />
                {/* <br />
                <input 
                    type="text" 
                    placeholder="Descriere (opțional)" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ marginTop: '10px', width: '300px' }}
                />
                <br /> */}
                <button onClick={handleUpload} disabled={isUploading} style={{ marginTop: '10px' }}>
                    {isUploading ? 'Loading...' : 'Upload'}
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            </div>

            {/* --- Secțiunea Galeriei --- */}
            <hr />
            <h3>Uploaded Files</h3>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                    {mediaList.length === 0 && <p>No media for this event yet.</p>}
                    
                    {mediaList.map(media => (
                        <div key={media.id} style={{ border: '1px solid #ddd', padding: '10px', width: '250px' }}>
                            
                            {/* Aici e logica de afișare PHOTO vs VIDEO */}
                            {media.mediaType === 'PHOTO' ? (
                                <img src={media.url} alt={media.description} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                            ) : (
                                <video src={media.url} controls style={{ width: '100%', height: '200px' }} />
                            )}
                            
                            {/* <p>{media.description || 'Fără descriere'}</p> */}
                            
                            <button onClick={() => handleDelete(media.id)} style={{ backgroundColor: 'darkred', color: 'white' }}>
                                Șterge
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <button onClick={() => navigate('/Login')} style={{ marginTop: '20px' }}>
                Back to loading
            </button>
        </div>
    );
};

export default EventGallery;

// const [success, setSuccess] = useState('');
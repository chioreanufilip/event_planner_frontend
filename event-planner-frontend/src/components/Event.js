import React, { useState } from 'react';
// 1. Importă noul tău 'api', NU 'axios'
import api from '../api.js'; 
import { useNavigate,Link } from 'react-router-dom';
import axios from 'axios';

const CreateWedding = () => {
    // 2. State pentru fiecare câmp din modelul tău Event.java
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [budget, setBudget] = useState(0);
    const [size, setSize] = useState(0);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // 3. Creează obiectul "Event" (așa cum e el în Java)
        const eventData = {
            name,
            location,
            date: date ? `${date}T00:00:00` : null, // Formatare simplă pt LocalDateTime
            budget,
            size
            // Nu trebuie să trimiți "organizer", backend-ul îl ia din token!
        };

        try {
            // 4. Folosește 'api.post'. Token-ul se adaugă automat!
            const response = await api.post('/api/event/create', eventData);

            setSuccess(`Wedding "${response.data.name}" has been successfully created!`);
            
          
            setName('');
            setLocation('');
            const newId=response.data.id;
            navigate(`/media/event/${newId}`);

        } catch (err) {
            console.error(err);
            if (err.response?.status === 403) {
                setError('Error. You do not have permission.');
            } else {
                setError('An error occurred while creating the wedding. Please try again.');
            }
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto', border: '1px solid #ccc', marginTop: '20px' }}>
            {/* 5. Aici punem textul "Wedding" */}
            <h2>Creează o Nuntă Nouă</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Numele Nunții:</label>
                    <input 
                        type="text" value={name} onChange={(e) => setName(e.target.value)}
                        required style={{ width: '100%' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Locație:</label>
                    <input 
                        type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                        required style={{ width: '100%' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Data:</label>
                    <input 
                        type="date" value={date} onChange={(e) => setDate(e.target.value)}
                        required style={{ width: '100%' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Buget:</label>
                    <input 
                        type="number" value={budget} onChange={(e) => setBudget(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Nr. Persoane:</label>
                    <input 
                        type="number" value={size} onChange={(e) => setSize(e.target.value)}
                        style={{ width: '100%' }}
                    />
                    {/* <p style={{ marginTop: '20px' }}>
                You want to upload photos or videos?
                <Link to="/media/event"> Kindly press here </Link>
            </p> */}
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}

                <button type="submit">Creează Nunta</button>
            </form>
        </div>
    );
};

export default CreateWedding;
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    
    // State pentru câmpurile comune
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // --- Cerința 1: Confirmă Parola ---
    const [confirmPassword, setConfirmPassword] = useState('');

    // --- Cerința 2: Tipul Contului ---
    const [accountType, setAccountType] = useState('participant'); // 'participant' e default



    // State pentru mesaje
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        console.log('Formularul a fost trimis');
        console.log('Date introduse:', { name, email, password, confirmPassword, accountType });

        // --- Validare Cerința 1 ---
        if (password !== confirmPassword) {
            setError('Parolele nu se potrivesc!');
            return; // Oprește trimiterea formularului
        }

        // --- Logică Cerința 2 ---
        let registrationUrl = '';
        let payload = {};

        if (accountType === 'participant') {
            registrationUrl = 'http://localhost:8080/api/auth/register/participant';
            payload = {
                name,
                email,
                password,
            };
        } else { // accountType === 'organizer'
            registrationUrl = 'http://localhost:8080/api/auth/register/organizer';
            payload = {
                name,
                email,
                password,
            };
        }

        // --- Trimiterea către Backend ---
        try {
            console.log('Se trimite cererea către:', registrationUrl);
            console.log('Payload:', payload);
            const response = await axios.post(registrationUrl, payload);
            console.log('Cont creat:', response.data);
            setSuccess('Cont creat cu succes! Vei fi redirecționat către pagina de login.');
            
            // Așteptăm puțin pentru a arăta mesajul de succes
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            
            
        } catch (err) {
            console.error('Eroare la înregistrare:', err.response?.data);
            setError('Eroare la înregistrare. Emailul ar putea fi deja folosit.');
        }
    };

    // Funcție ajutătoare pentru a schimba tipul de cont și a reseta erorile
    const handleAccountTypeChange = (e) => {
        setAccountType(e.target.value);
        setError('');
        setSuccess('');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', border: '1px solid #ccc', marginTop: '20px' }}>
            <h2>Creează un Cont Nou</h2>
            <form onSubmit={handleSubmit}>

                {/* --- Selector Tip Cont (Cerința 2) --- */}
                <div style={{ marginBottom: '10px' }}>
                    <label>Tipul contului:</label>
                    <select 
                        value={accountType} 
                        onChange={handleAccountTypeChange} 
                        style={{ width: '100%' }}
                    >
                        <option value="participant">Participant</option>
                        <option value="organizer">Organizator</option>
                    </select>
                </div>

                {/* --- Câmpuri Comune --- */}
                <div style={{ marginBottom: '10px' }}>
                    <label>Nume:</label>
                    <input 
                        type="text" value={name} onChange={(e) => setName(e.target.value)}
                        required style={{ width: '100%' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Email:</label>
                    <input 
                        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        required style={{ width: '100%' }}
                    />
                </div>

                {/* --- Câmpuri Parolă (Cerința 1) --- */}
                <div style={{ marginBottom: '10px' }}>
                    <label>Parolă:</label>
                    <input 
                        type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        required style={{ width: '100%' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Confirmă Parola:</label>
                    <input 
                        type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        required style={{ width: '100%' }}
                    />
                </div>

                {/* --- Câmpuri Condiționale (Afișate pe baza tipului de cont) --- */}
                
                {/* Afișează asta DOAR dacă e participant */}
                {/* {accountType === 'participant' && (
                    <div style={{ marginBottom: '10px' }}>
                        <label>Statut RSVP implicit:</label>
                        <select 
                            value={rsvpStatus} 
                            onChange={(e) => setRsvpStatus(e.target.value)} 
                            style={{ width: '100%' }}
                        >
                            <option value="INTERESTED">Interesat</option>
                            <option value="GOING">Particip</option>
                            <option value="NOT_GOING">Nu particip</option>
                        </select>
                    </div>
                )}
                
                {/* Afișează asta DOAR dacă e organizator */}
                {/* {accountType === 'organizer' && (
                    <div style={{ marginBottom: '10px' }}>
                        <label>Nume Companie (Opțional):</label>
                        <input 
                            type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </div>
                )} */} 
                
                {/* --- Mesaje de eroare/succes --- */}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}

                <button type="submit">Creează Cont</button>
            </form>
            
            <p style={{ marginTop: '20px' }}>
                Ai deja un cont? 
                <Link to="/login"> Mergi la Login</Link>
            </p>
        </div>
    );
};

export default Register;
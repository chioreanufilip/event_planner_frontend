import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login = () => {
    // Folosim "useState" pentru a ține minte ce scrie user-ul
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Pentru a afișa erori

    // Această funcție se apelează când se apasă butonul "Submit"
    const handleSubmit = async (e) => {
        // Previne reîncărcarea paginii (comportamentul default al form-ului)
        e.preventDefault(); 
        setError(''); // Resetează eroarea la fiecare încercare

        try {
            // 1. Aici facem cererea POST către backend
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email: email,
                password: password
            });

            // 2. Dacă funcționează, backend-ul ne va trimite un token
            const token = response.data.token; // Presupunem că răspunsul arată așa: { "token": "..." }

            // 3. Salvăm token-ul în "localStorage"-ul browser-ului
            // Asta îl ține pe utilizator logat
            localStorage.setItem('token', token);
            
            console.log('Login reușit! Token:', token);
            // alert('Login reușit!');
            
            // Aici ai putea redirecționa user-ul către altă pagină (de ex. /dashboard)
            // window.location.href = '/dashboard';

        } catch (err) {
            // 4. Dacă backend-ul ne dă eroare (parolă/email greșit)
            console.error('Eroare la login:', err.response.data);
            setError('Email sau parolă incorectă. Te rog reîncearcă.');
        }
    };

    // Acesta este HTML-ul (JSX) pe care îl vede user-ul
    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Actualizează starea "email"
                        required 
                        style={{ width: '100%' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Password:</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Actualizează starea "password"
                        required 
                        style={{ width: '100%' }}
                    />
                </div>
                
                {error && <p style={{ color: 'red' }}>{error}</p>} 

                <button type="submit">Login</button>
            </form>
            <p style={{ marginTop: '20px' }}>
                Nu ai un cont? 
                <Link to="/register"> Înregistrează-te aici</Link>
            </p>
        </div>
    );
};

export default Login;
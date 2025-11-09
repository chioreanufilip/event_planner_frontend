import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080' 
});

// 2. Creează un "interceptor"
// Acesta este un paznic care se uită la FIECARE cerere înainte să plece
api.interceptors.request.use(
    (config) => {
        // 3. Ia token-ul din localStorage
        const token = localStorage.getItem('token');
        // const user = localStorage.getItem(JSON.stringify('user'));
        // 4. Dacă token-ul există, adaugă-l în header
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
    
        }
        return config; // Trimite cererea modificată mai departe
    },
    (error) => {
        return Promise.reject(error);
    }

);
api.interceptors.response.use(
    (response) => {
        // Orice status 2xx intră aici
        return response;
    }, 
    (error) => {
        // Aici prindem erorile (4xx, 5xx)
        if (error.response && error.response.status === 401) {
            // Dacă primim 401 (Unauthorized) sau 403 (Forbidden)
            // înseamnă că token-ul e rău (expirat sau invalid)
            
            console.log("Token expirat sau invalid. Se face logout...");
            
            // 1. Șterge datele vechi
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // 2. Redirecționează la /login
            // Folosim 'window.location' pentru că suntem în afara 
            // contextului React (nu putem folosi 'useNavigate')
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
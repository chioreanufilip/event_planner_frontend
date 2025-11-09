import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import CreateWedding from './components/Event';
import EventGallery from './components/EventGallery';
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {/* <header className="App-header"> */}
          {/* <h1>Event Planner</h1>
          {/* Poți păstra sau șterge link-urile de navigare de aici,
              depinde dacă vrei să le ai și în header */}
        {/* </header> */} 

        <Routes>
          {/* Când URL-ul este /login, afișează componenta Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Când URL-ul este /register, afișează componenta Register */}
          <Route path="/register" element={<Register />} />
          
          {/* Când intri pe site (URL-ul este "/"), te trimite automat la /login */}
          <Route path="/" element={<Navigate replace to="/login" />} />

          <Route path="/event/create" element={<CreateWedding />} />
          <Route path="media/event/:eventId" element={<EventGallery />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;

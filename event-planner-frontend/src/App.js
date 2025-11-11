import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Events from './components/Events';
import CreateEvent from './components/CreateEvent';
import EventDetails from './components/EventDetails';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Landing />} />

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route
                        path="/events"
                        element={
                            <ProtectedRoute>
                                <Events />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/event/create"
                        element={
                            <ProtectedRoute requireOrganizer>
                                <CreateEvent />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/event/:eventId"
                        element={
                            <ProtectedRoute>
                                <EventDetails />
                            </ProtectedRoute>
                        }
                    />

                    {/* Fallback redirect */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
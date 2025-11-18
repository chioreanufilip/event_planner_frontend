import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Events from './components/Events';
import CreateEvent from './components/CreateEvent';
import EventDetails from './components/EventDetails';
import ProtectedRoute from './components/ProtectedRoute';
import EventGallery from './components/EventGallery';
import Invitations from './components/Invitations';
import Navbar from './components/Navbar';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Landing />} />

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />

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

                    <Route
                        path="/media/event/:eventId"
                        element={
                            <ProtectedRoute>
                                <EventGallery />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/event/:eventId/invitations"
                        element={
                            <ProtectedRoute requireOrganizer>
                                <Invitations />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
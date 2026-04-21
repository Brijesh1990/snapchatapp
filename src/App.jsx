import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Camera from './pages/Camera';
import Chat from './pages/Chat';
import Stories from './pages/Stories';
import Profile from './pages/Profile';
import Conversation from './pages/Conversation';
import Search from './pages/Search';
import Map from './pages/Map';
import Spotlight from './pages/Spotlight';

// Components
import BottomNav from './components/BottomNav';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

function App() {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    return (
        <AuthProvider>
            <Router>
                <div className="flex flex-col h-screen bg-black">
                    <div className="flex-1 overflow-y-auto">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            
                            <Route path="/" element={
                                <ProtectedRoute>
                                    <Camera />
                                </ProtectedRoute>
                            } />

                            <Route path="/map" element={
                                <ProtectedRoute>
                                    <Map />
                                </ProtectedRoute>
                            } />

                            <Route path="/spotlight" element={
                                <ProtectedRoute>
                                    <Spotlight />
                                </ProtectedRoute>
                            } />
                            
                            <Route path="/chat" element={
                                <ProtectedRoute>
                                    <Chat />
                                </ProtectedRoute>
                            } />

                            <Route path="/chat/:id" element={
                                <ProtectedRoute>
                                    <Conversation />
                                </ProtectedRoute>
                            } />
                            
                            <Route path="/stories" element={
                                <ProtectedRoute>
                                    <Stories />
                                </ProtectedRoute>
                            } />
                            
                            <Route path="/profile" element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            } />

                            <Route path="/search" element={
                                <ProtectedRoute>
                                    <Search />
                                </ProtectedRoute>
                            } />
                        </Routes>
                    </div>
                    <ConditionalBottomNav />
                </div>
            </Router>
        </AuthProvider>
    );
}

const ConditionalBottomNav = () => {
    const { user } = useAuth();
    const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';
    const isConversation = window.location.pathname.startsWith('/chat/');

    if (!user || isAuthPage || isConversation) return null;
    return <BottomNav />;
}

export default App;

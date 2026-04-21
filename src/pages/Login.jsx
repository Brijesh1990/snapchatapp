import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Ghost } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await login(email, password);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen bg-snapchat-yellow flex flex-col items-center justify-center px-6 relative overflow-hidden">
            <div className="absolute top-20 text-black flex flex-col items-center" data-aos="fade-down">
                <div className="bg-black p-4 rounded-3xl mb-4">
                    <Ghost size={60} color="#FFFC00" fill="#FFFC00" />
                </div>
                <h1 className="text-3xl font-bold font-snapchat">Snapchat</h1>
            </div>

            <div className="w-full max-w-sm mt-20" data-aos="zoom-in">
                <h2 className="text-2xl font-bold mb-8 text-center">Log In</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Email</label>
                        <input 
                            type="email" 
                            className="w-full p-4 rounded-xl border-none focus:ring-2 focus:ring-black outline-none bg-white shadow-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Password</label>
                        <input 
                            type="password" 
                            className="w-full p-4 rounded-xl border-none focus:ring-2 focus:ring-black outline-none bg-white shadow-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}

                    <button 
                        type="submit"
                        className="w-full bg-black text-white font-bold py-4 rounded-full shadow-lg transform active:scale-95 transition-all mt-6"
                    >
                        Log In
                    </button>
                </form>

                <p className="mt-8 text-center text-sm font-medium">
                    New to Snapchat? <Link to="/register" className="text-blue-600 font-bold hover:underline">Sign Up</Link>
                </p>
            </div>

            {/* Decorative circles */}
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/20 rounded-full blur-3xl"></div>
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/20 rounded-full blur-3xl"></div>
        </div>
    );
};

export default Login;

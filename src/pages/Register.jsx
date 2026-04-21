import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Ghost, Camera } from 'lucide-react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState('https://res.cloudinary.com/demo/image/upload/v1631234567/sample_avatar.png');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await register(username, email, password, avatar);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen bg-snapchat-yellow flex flex-col items-center justify-center px-6 relative overflow-hidden">
            <div className="absolute top-10 text-black flex flex-col items-center" data-aos="fade-down">
                <div className="bg-black p-3 rounded-2xl mb-2">
                    <Ghost size={40} color="#FFFC00" fill="#FFFC00" />
                </div>
                <h1 className="text-2xl font-bold font-snapchat">Snapchat</h1>
            </div>

            <div className="w-full max-w-sm mt-16" data-aos="fade-up">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex justify-center mb-4">
                        <div className="relative group cursor-pointer">
                            <img 
                                src={avatar} 
                                alt="Avatar" 
                                className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
                            />
                            <div className="absolute bottom-0 right-0 bg-black p-2 rounded-full border-2 border-white">
                                <Camera size={14} color="white" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Username</label>
                        <input 
                            type="text" 
                            className="w-full p-4 rounded-xl border-none focus:ring-2 focus:ring-black outline-none bg-white shadow-sm"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

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
                        className="w-full bg-black text-white font-bold py-4 rounded-full shadow-lg transform active:scale-95 transition-all mt-4"
                    >
                        Sign Up & Accept
                    </button>
                    
                    <p className="text-[10px] text-center text-gray-700 px-4">
                        By tapping Sign Up & Accept, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </form>

                <p className="mt-6 text-center text-sm font-medium">
                    Already on Snapchat? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;

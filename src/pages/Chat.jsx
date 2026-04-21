import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Camera, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
    const { user } = useAuth();
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFriends();
    }, []);

    const fetchFriends = async () => {
        try {
            const { data } = await API.get('/users/profile');
            setFriends(data.friends || []);
        } catch (error) {
            console.error('Failed to fetch friends', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 px-4 py-3 flex justify-between items-center border-b border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <Link to="/profile" className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden">
                        <img src={user?.avatar} alt="Me" className="w-full h-full object-cover" />
                    </Link>
                    <div className="p-2 bg-gray-100 rounded-full">
                        <Search size={20} className="text-gray-600" />
                    </div>
                </div>
                <h1 className="text-xl font-bold font-snapchat">Chat</h1>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                        <UserPlus size={20} className="text-gray-600" />
                    </div>
                    <div className="p-2 bg-snapchat-blue/10 rounded-full">
                        <MessageCircle size={20} className="text-snapchat-blue" />
                    </div>
                </div>
            </div>

            {/* Chat List */}
            <div className="pb-24">
                {loading ? (
                    <div className="p-4 space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex gap-4 items-center animate-pulse">
                                <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                    <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : friends.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400 px-10 text-center">
                        <Ghost className="mb-4 opacity-20" size={80} />
                        <p className="text-lg font-medium">Your chat list is empty</p>
                        <p className="text-sm">Find your friends to start chatting!</p>
                        <button className="mt-6 bg-snapchat-blue text-white px-8 py-3 rounded-full font-bold">
                            Add Friends
                        </button>
                    </div>
                ) : (
                    friends.map((friend) => (
                        <Link 
                            key={friend._id} 
                            to={`/chat/${friend._id}`}
                            className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-50"
                        >
                            <div className="relative">
                                <img 
                                    src={friend.avatar} 
                                    alt={friend.username} 
                                    className="w-14 h-14 rounded-full border border-gray-200 object-cover"
                                />
                                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg leading-tight">{friend.username}</h3>
                                <div className="flex items-center gap-1 text-gray-500 text-sm">
                                    <span className="text-snapchat-pink font-semibold">New Snap</span>
                                    <span>•</span>
                                    <span>2m</span>
                                </div>
                            </div>
                            <div className="text-snapchat-gray/40">
                                <Camera size={24} />
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

const Ghost = ({ className, size }) => (
    <svg 
        className={className} 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M9 10L9.01 10M15 10L15.01 10M12 2C7.03 2 3 6.03 3 11V20L5 18L7 20L9 18L11 20L13 18L15 20L17 18L19 20L21 18V11C21 6.03 16.97 2 12 2Z" />
    </svg>
);

export default Chat;

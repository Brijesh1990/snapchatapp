import React, { useState, useEffect } from 'react';
import { Settings, Share, Ghost, MapPin, Grid, Play, LogOut, ChevronRight, Check, X, UserSearch, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const Profile = () => {
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [newBio, setNewBio] = useState('');
    const [newAvatar, setNewAvatar] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const [profileRes, requestsRes] = await Promise.all([
                API.get('/users/profile'),
                API.get('/users/requests')
            ]);
            setProfile(profileRes.data);
            setPendingRequests(requestsRes.data);
            setNewBio(profileRes.data.bio || '');
            setNewAvatar(profileRes.data.avatar || '');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        setUpdating(true);
        try {
            const { data } = await API.put('/users/profile', { bio: newBio, avatar: newAvatar });
            updateUser(data);
            setIsEditing(false);
            fetchProfileData();
        } catch (err) {
            console.error(err);
            alert('Failed to update profile: ' + (err.response?.data?.message || 'Error occurred'));
        } finally {
            setUpdating(false);
        }
    };

    const handleRequest = async (requestId, status) => {
        try {
            await API.put(`/users/friend-request/${requestId}`, { status });
            fetchProfileData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) return (
        <div className="h-screen bg-gray-100 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-snapchat-yellow border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="flex justify-between items-center p-4">
                <button 
                    onClick={() => navigate(-1)} 
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-sm"
                >
                    <ChevronRight className="rotate-180" size={24} />
                </button>
                <div className="flex gap-3">
                    <Link to="/search" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-snapchat-blue shadow-sm">
                        <UserSearch size={20} />
                    </Link>
                    <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all ${
                            isEditing ? 'bg-snapchat-blue text-white' : 'bg-white text-gray-400'
                        }`}
                    >
                        <Settings size={20} />
                    </button>
                </div>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col items-center px-6" data-aos="zoom-in">
                <div className="relative mb-4 group">
                    <div className="w-32 h-32 bg-snapchat-yellow rounded-[40px] flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                        <img src={isEditing && newAvatar ? newAvatar : profile?.avatar} className="w-full h-full object-cover" alt="" />
                    </div>
                    {isEditing && (
                        <div className="absolute inset-0 bg-black/40 rounded-[40px] flex items-center justify-center text-white cursor-pointer" onClick={() => {
                            const url = prompt("Enter new Avatar URL:");
                            if(url) setNewAvatar(url);
                        }}>
                            <Camera size={24} />
                        </div>
                    )}
                </div>

                {isEditing ? (
                    <div className="w-full max-w-xs space-y-3 mt-2">
                        <input 
                            className="w-full p-3 rounded-xl border-none text-center font-bold text-lg focus:ring-2 focus:ring-snapchat-blue outline-none"
                            value={profile?.username}
                            disabled
                        />
                        <textarea 
                            className="w-full p-3 rounded-xl border-none text-center text-sm text-gray-600 focus:ring-2 focus:ring-snapchat-blue outline-none resize-none"
                            placeholder="Add a bio..."
                            value={newBio}
                            onChange={(e) => setNewBio(e.target.value)}
                            rows={2}
                        />
                        <button 
                            onClick={handleUpdateProfile}
                            disabled={updating}
                            className="w-full bg-snapchat-blue text-white font-bold py-3 rounded-full shadow-lg active:scale-95 transition-all text-sm"
                        >
                            {updating ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold">{profile?.username}</h1>
                        <p className="text-gray-500 font-medium text-sm">{profile?.email}</p>
                        {profile?.bio && <p className="mt-2 text-gray-600 text-sm text-center max-w-xs">{profile.bio}</p>}
                        
                        <div className="flex items-center gap-3 mt-4 px-6 py-2 bg-white rounded-full shadow-sm">
                            <span className="text-snapchat-purple font-bold">12,458</span>
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Snap Score</span>
                            <span className="text-snapchat-yellow text-lg">♉</span>
                        </div>
                    </>
                )}
            </div>

            {/* Content Sections */}
            <div className="mt-8 px-4 space-y-4 pb-24">
                
                {/* Pending Requests */}
                {pendingRequests.length > 0 && (
                    <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-snapchat-yellow/20" data-aos="fade-up">
                        <h3 className="font-bold text-lg mb-4 flex justify-between items-center px-1">
                            Added Me
                            <span className="bg-snapchat-yellow text-[10px] uppercase font-bold px-3 py-1 rounded-full">{pendingRequests.length} Requests</span>
                        </h3>
                        <div className="space-y-4">
                            {pendingRequests.map((req) => (
                                <div key={req._id} className="flex items-center justify-between bg-gray-50/50 p-2 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <img src={req.sender.avatar} className="w-12 h-12 rounded-full object-cover border-2 border-white" alt="" />
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm">{req.sender.username}</span>
                                            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">Wants to be friends</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pr-1">
                                        <button 
                                            onClick={() => handleRequest(req._id, 'accepted')}
                                            className="bg-snapchat-blue text-white p-2.5 rounded-full shadow-md active:scale-95 transition-all"
                                        >
                                            <Check size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleRequest(req._id, 'rejected')}
                                            className="bg-white text-gray-400 p-2.5 rounded-full shadow-md active:scale-95 transition-all"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* My Stories */}
                <div className="bg-white rounded-3xl p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h3 className="font-bold text-lg">My Stories</h3>
                        <Link to="/" className="text-snapchat-blue font-bold text-xs uppercase tracking-widest">
                            + New Story
                        </Link>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <div className="w-14 h-14 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
                            <Play size={24} fill="currentColor" />
                        </div>
                        <div>
                            <p className="font-bold text-sm">Add to My Story</p>
                            <p className="text-[11px] text-gray-400 font-medium">Tap to create your first snap!</p>
                        </div>
                    </div>
                </div>

                {/* Friends */}
                <div className="bg-white rounded-3xl p-5 shadow-sm">
                    <h3 className="font-bold text-lg mb-4 px-1">Friends</h3>
                    <div className="space-y-2">
                        <Link to="/search" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-snapchat-yellow/20 rounded-full text-snapchat-yellow shadow-inner">
                                    <Ghost size={24} fill="currentColor" />
                                </div>
                                <span className="font-bold text-sm">Add Friends</span>
                            </div>
                            <ChevronRight size={20} className="text-gray-300" />
                        </Link>
                        <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-snapchat-blue/20 rounded-full text-snapchat-blue shadow-inner">
                                    <Grid size={24} fill="currentColor" />
                                </div>
                                <span className="font-bold text-sm">My Friends</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="bg-gray-100 text-gray-500 font-bold text-[10px] px-2 py-1 rounded-full">
                                    {profile?.friends?.length || 0}
                                </span>
                                <ChevronRight size={20} className="text-gray-300" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logout */}
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-5 bg-white rounded-3xl text-red-500 font-bold shadow-sm active:scale-[0.98] transition-all text-sm uppercase tracking-widest"
                >
                    <LogOut size={20} />
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default Profile;

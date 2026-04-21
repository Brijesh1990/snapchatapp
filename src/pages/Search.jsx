import React, { useState } from 'react';
import { Search as SearchIcon, UserPlus, ArrowLeft, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sentRequests, setSentRequests] = useState([]);
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleSearch = async (e) => {
        const val = e.target.value;
        setQuery(val);
        if (val.length > 2) {
            setLoading(true);
            try {
                const { data } = await API.get(`/users/search?q=${val}`);
                setResults(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        } else {
            setResults([]);
        }
    };

    const sendRequest = async (id) => {
        try {
            await API.post(`/users/friend-request/${id}`);
            setSentRequests([...sentRequests, id]);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to send request');
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="p-4 border-b border-gray-100 flex items-center gap-4 bg-white sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="text-gray-500">
                    <ArrowLeft size={24} />
                </button>
                <div className="flex-1 bg-gray-100 rounded-full px-4 flex items-center gap-2">
                    <SearchIcon size={18} className="text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search for friends..." 
                        className="bg-transparent py-2.5 outline-none flex-1 text-sm font-medium"
                        value={query}
                        onChange={handleSearch}
                        autoFocus
                    />
                </div>
            </div>

            <div className="p-4">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="w-8 h-8 border-4 border-snapchat-blue border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : results.length > 0 ? (
                    <div className="space-y-4">
                        {results.map((profile) => (
                            <div key={profile._id} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <img src={profile.avatar} className="w-12 h-12 rounded-full object-cover" alt="" />
                                    <div>
                                        <h3 className="font-bold">{profile.username}</h3>
                                        <p className="text-xs text-gray-400">@{profile.username.toLowerCase()}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => sendRequest(profile._id)}
                                    disabled={sentRequests.includes(profile._id)}
                                    className={`px-6 py-2 rounded-full text-sm font-bold shadow-sm transition-all ${
                                        sentRequests.includes(profile._id) 
                                            ? 'bg-gray-200 text-gray-400' 
                                            : 'bg-snapchat-blue text-white active:scale-95'
                                    }`}
                                >
                                    {sentRequests.includes(profile._id) ? 'Pending' : 'Add Friend'}
                                </button>
                            </div>
                        ))}
                    </div>
                ) : query.length > 2 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p>No users found for "{query}"</p>
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-400">
                        <p>Start typing to find your friends</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;

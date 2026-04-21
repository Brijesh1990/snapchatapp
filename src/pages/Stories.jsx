import React, { useState, useEffect } from 'react';
import { Search, UserPlus, MoreHorizontal, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Stories = () => {
    const { user } = useAuth();
    const [groupedStories, setGroupedStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUserStories, setSelectedUserStories] = useState(null);

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const { data } = await API.get('/stories');
            setGroupedStories(data);
        } catch (error) {
            console.error(error);
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
                <h1 className="text-xl font-bold font-snapchat">Stories</h1>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                        <UserPlus size={20} className="text-gray-600" />
                    </div>
                    <div className="p-2 bg-gray-100 rounded-full">
                        <MoreHorizontal size={20} className="text-gray-600" />
                    </div>
                </div>
            </div>

            {/* Friends Stories (Horizontal) */}
            <div className="p-4 overflow-x-auto no-scrollbar">
                <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-1 min-w-[70px]">
                        <div className="w-16 h-16 rounded-full border-2 border-gray-200 p-1 bg-white flex items-center justify-center relative">
                            <img src={user?.avatar} className="w-full h-full rounded-full object-cover grayscale opacity-50" alt="" />
                            <div className="absolute inset-0 flex items-center justify-center text-snapchat-purple">
                                <span className="text-2xl font-bold">+</span>
                            </div>
                        </div>
                        <span className="text-xs font-semibold text-gray-500">Add Story</span>
                    </div>

                    {groupedStories.map((group, index) => (
                        <div 
                            key={index} 
                            className="flex flex-col items-center gap-1 min-w-[70px] cursor-pointer"
                            onClick={() => setSelectedUserStories(group)}
                        >
                            <div className="w-16 h-16 rounded-full border-2 border-snapchat-purple p-1 bg-white">
                                <img src={group.user.avatar} className="w-full h-full rounded-full object-cover" alt="" />
                            </div>
                            <span className="text-xs font-semibold">{group.user.username}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Discover Section */}
            <div className="px-4 py-2">
                <h2 className="text-lg font-bold mb-3">Discover</h2>
                <div className="grid grid-cols-2 gap-3 pb-24">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div 
                            key={i} 
                            className="h-64 bg-gray-200 rounded-xl relative overflow-hidden shadow-sm"
                            data-aos="fade-up"
                            data-aos-delay={i * 100}
                        >
                            <img src={`https://picsum.photos/400/600?random=${i}`} className="w-full h-full object-cover" alt="" />
                            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-white text-xs font-bold leading-tight line-clamp-2">
                                    {i % 2 === 0 ? "How to make the perfect burger in 5 minutes" : "Top 10 travel destinations for 2026"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Story Viewer Overlay */}
            {selectedUserStories && (
                <StoryViewer 
                    group={selectedUserStories} 
                    onClose={() => setSelectedUserStories(null)} 
                />
            )}
        </div>
    );
};

const StoryViewer = ({ group, onClose }) => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const story = group.stories[currentIdx];

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentIdx < group.stories.length - 1) {
                setCurrentIdx(currentIdx + 1);
            } else {
                onClose();
            }
        }, 5000);
        return () => clearTimeout(timer);
    }, [currentIdx, group.stories.length, onClose]);

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
            {/* Progress Bars */}
            <div className="absolute top-4 inset-x-4 flex gap-1 z-20">
                {group.stories.map((_, i) => (
                    <div key={i} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                        <div 
                            className={`h-full bg-white transition-all duration-[5000ms] linear ${
                                i < currentIdx ? 'w-full' : (i === currentIdx ? 'w-full' : 'w-0')
                            }`}
                        ></div>
                    </div>
                ))}
            </div>

            {/* Header info */}
            <div className="absolute top-8 inset-x-4 flex justify-between items-center z-20 text-white">
                <div className="flex items-center gap-2">
                    <img src={group.user.avatar} className="w-8 h-8 rounded-full border border-white" alt="" />
                    <span className="font-bold text-sm">{group.user.username}</span>
                    <span className="text-xs text-white/60">2h</span>
                </div>
                <button onClick={onClose} className="p-2">
                    <Settings size={20} className="rotate-45" /> 
                </button>
            </div>

            {/* Media Content */}
            <div className="w-full h-full">
                {story.mediaType === 'video' ? (
                    <video src={story.mediaUrl} className="w-full h-full object-cover" autoPlay />
                ) : (
                    <img src={story.mediaUrl} className="w-full h-full object-cover" alt="" />
                )}
            </div>

            {/* Navigation Areas */}
            <div className="absolute inset-0 flex">
                <div className="flex-1 h-full" onClick={() => currentIdx > 0 && setCurrentIdx(currentIdx - 1)}></div>
                <div className="flex-1 h-full" onClick={() => currentIdx < group.stories.length - 1 ? setCurrentIdx(currentIdx + 1) : onClose()}></div>
            </div>
        </div>
    );
};

export default Stories;

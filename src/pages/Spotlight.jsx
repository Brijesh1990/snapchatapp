import React, { useState } from 'react';
import { ChevronLeft, Search, Heart, MessageCircle, Send, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Spotlight = () => {
    const navigate = useNavigate();
    const [liked, setLiked] = useState(false);

    const videos = [
        "https://res.cloudinary.com/demo/video/upload/c_fill,h_800,w_450/v1631234567/sample_video.mp4",
        "https://res.cloudinary.com/demo/video/upload/c_fill,h_800,w_450/v1631234568/sample_video_2.mp4"
    ];

    return (
        <div className="h-screen bg-black relative overflow-hidden">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 text-white">
                <button onClick={() => navigate(-1)} className="p-2 bg-black/20 rounded-full backdrop-blur-sm">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex gap-4">
                    <button className="p-2 bg-black/20 rounded-full backdrop-blur-sm">
                        <Search size={22} />
                    </button>
                    <button className="p-2 bg-black/20 rounded-full backdrop-blur-sm text-snapchat-yellow">
                        <span className="font-bold">Spotlight</span>
                    </button>
                </div>
            </div>

            {/* Video Viewport (Simulation) */}
            <div className="h-full w-full flex items-center justify-center bg-zinc-900">
                <video 
                    src={videos[0]} 
                    className="h-full w-full object-cover"
                    autoPlay
                    loop
                    muted
                />
                
                {/* Right Actions */}
                <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6 z-20">
                    <div className="flex flex-col items-center gap-1">
                        <button 
                            onClick={() => setLiked(!liked)}
                            className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-all ${liked ? 'bg-red-500 scale-110' : 'bg-black/20'}`}
                        >
                            <Heart size={24} fill={liked ? "white" : "none"} color="white" />
                        </button>
                        <span className="text-white text-xs font-bold">12.4k</span>
                    </div>
                    
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-12 h-12 bg-black/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                            <MessageCircle size={24} color="white" />
                        </div>
                        <span className="text-white text-xs font-bold">452</span>
                    </div>

                    <div className="w-12 h-12 bg-black/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                        <Send size={24} color="white" />
                    </div>

                    <div className="w-12 h-12 bg-black/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                        <MoreHorizontal size={24} color="white" />
                    </div>
                </div>

                {/* Bottom Profile Info */}
                <div className="absolute bottom-28 left-6 right-16 z-20 text-white">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                            <img src="https://picsum.photos/100" alt="" />
                        </div>
                        <span className="font-bold">@nature_explorer</span>
                        <button className="bg-white text-black px-4 py-1 rounded-full text-xs font-bold">Subscribe</button>
                    </div>
                    <p className="text-sm font-medium line-clamp-2">The most beautiful sunset I have ever seen in the mountains #nature #discovery #viral</p>
                </div>
            </div>

            {/* Nav Padding */}
            <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
    );
};

export default Spotlight;

import React, { useState } from 'react';
import { ChevronLeft, MapPin, Search, Layers, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Map = () => {
    const navigate = useNavigate();

    return (
        <div className="relative h-screen bg-gray-200 overflow-hidden">
            {/* Map Placeholder with styling */}
            <div className="absolute inset-0 bg-[#e5e3df]">
                <img
                    src=""
                    className="w-full h-full object-cover opacity-80"
                    alt="Map"
                />
            </div>

            {/* UI Overlays */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10">
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div className="bg-white px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2">
                        <Search size={18} className="text-gray-400" />
                        <span className="text-sm font-bold">Search Map</span>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <Layers size={20} />
                    </button>
                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-snapchat-blue">
                        <Navigation size={20} fill="currentColor" />
                    </button>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="absolute bottom-24 left-0 right-0 px-6 flex justify-between items-center z-10">
                <div className="bg-white p-4 rounded-3xl shadow-xl flex items-center gap-3 animate-slide-up">
                    <div className="p-2 bg-snapchat-blue/10 rounded-full">
                        <MapPin size={24} className="text-snapchat-blue" />
                    </div>
                    <div>
                        <p className="font-bold text-sm">Friends on Map</p>
                        <p className="text-xs text-gray-400">Share your location</p>
                    </div>
                </div>
                <div className="bg-snapchat-yellow p-4 rounded-full shadow-xl">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <span className="text-xl">👤</span>
                    </div>
                </div>
            </div>

            {/* Nav Padding */}
            <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
    );
};

export default Map;

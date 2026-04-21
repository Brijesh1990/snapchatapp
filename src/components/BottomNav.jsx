import React from 'react';
import { NavLink } from 'react-router-dom';
import { MapPin, MessageSquare, Camera, Users, PlayCircle } from 'lucide-react';

const BottomNav = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-black text-white flex justify-around items-center py-4 px-2 z-50 border-t border-gray-800">
            <NavLink to="/map" className={({isActive}) => isActive ? 'text-snapchat-blue' : 'text-gray-400'}>
                <MapPin size={28} />
            </NavLink>
            
            <NavLink to="/chat" className={({isActive}) => isActive ? 'text-snapchat-blue' : 'text-gray-400'}>
                <MessageSquare size={28} />
            </NavLink>
            
            <NavLink to="/" className={({isActive}) => isActive ? 'text-snapchat-yellow scale-125' : 'text-white'}>
                <div className="bg-white/10 p-2 rounded-full border-2 border-white">
                    <Camera size={32} />
                </div>
            </NavLink>
            
            <NavLink to="/stories" className={({isActive}) => isActive ? 'text-snapchat-purple' : 'text-gray-400'}>
                <Users size={28} />
            </NavLink>
            
            <NavLink to="/spotlight" className={({isActive}) => isActive ? 'text-snapchat-pink' : 'text-gray-400'}>
                <PlayCircle size={28} />
            </NavLink>
        </div>
    );
};

export default BottomNav;

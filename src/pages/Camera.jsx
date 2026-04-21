import React, { useState, useRef } from 'react';
import { Camera as CameraIcon, Image as ImageIcon, Zap, RefreshCw, User, Search, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import API from '../services/api';

const Camera = () => {
    const { user } = useAuth();
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleUploadStory = async () => {
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('media', file);

        try {
            await API.post('/stories', formData);
            setPreview(null);
            setFile(null);
            // Optionally navigate to see the story
            alert('Story added successfully!');
        } catch (error) {
            console.error('Upload failed', error);
            alert('Selection failed: ' + (error.response?.data?.message || 'Check your internet or credentials'));
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="relative h-screen bg-black overflow-hidden select-none">
            {/* Top UI */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/50 to-transparent">
                <div className="flex items-center gap-4">
                    <Link to="/profile" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                        <User size={24} color="white" />
                    </Link>
                    <Link to="/search" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                        <Search size={24} color="white" />
                    </Link>
                </div>
                <div className="flex flex-col gap-5 items-center">
                    <RefreshCw size={24} color="white" className="drop-shadow-lg" />
                    <Zap size={24} color="gray" className="drop-shadow-lg" />
                    <Settings size={24} color="white" className="drop-shadow-lg" />
                </div>
            </div>

            {/* Camera Viewport (Simulation) */}
            <div className="h-full w-full bg-neutral-900 flex items-center justify-center relative">
                {preview ? (
                    <div className="h-full w-full relative">
                        {file.type.startsWith('video') ? (
                            <video src={preview} className="h-full w-full object-cover" autoPlay loop muted />
                        ) : (
                            <img src={preview} className="h-full w-full object-cover" alt="preview" />
                        ) }
                        
                        <div className="absolute bottom-32 left-0 right-0 px-10 flex justify-between z-30">
                            <button 
                                onClick={() => {setPreview(null); setFile(null);}}
                                className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full text-white font-bold"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleUploadStory}
                                disabled={uploading}
                                className="bg-snapchat-yellow px-8 py-3 rounded-full text-black font-bold shadow-lg transform active:scale-95"
                            >
                                {uploading ? 'Sending...' : 'Send to Story'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-white text-opacity-20 flex flex-col items-center">
                        <CameraIcon size={120} strokeWidth={1} />
                        <p className="mt-4 font-mono">CAMERA SIMULATION</p>
                    </div>
                )}
            </div>

            {/* Bottom Controls */}
            {!preview && (
                <div className="absolute bottom-24 left-0 right-0 flex justify-center items-center gap-12 z-20">
                    <button 
                        onClick={() => fileInputRef.current.click()}
                        className="w-16 h-16 flex items-center justify-center bg-white/10 rounded-2xl backdrop-blur-md border border-white/20"
                    >
                        <ImageIcon size={32} color="white" />
                    </button>

                    <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1 bg-transparent transform transition active:scale-90 cursor-pointer">
                        <div className="w-full h-full bg-white rounded-full"></div>
                    </div>

                    <div className="w-16 h-16"></div> {/* Placeholder */}
                </div>
            )}

            <input 
                type="file" 
                hidden 
                ref={fileInputRef} 
                accept="image/*,video/*"
                onChange={handleFileChange}
            />
        </div>
    );
};

export default Camera;

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, Mic, Image, Info, Send } from 'lucide-react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Conversation = () => {
    const { id: receiverId } = useParams();
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [receiver, setReceiver] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const socket = useRef();
    const scrollRef = useRef();

    useEffect(() => {
        socket.current = io('http://127.0.0.1:5000');
        socket.current.emit('addUser', currentUser._id);

        socket.current.on('getMessage', (data) => {
            setMessages((prev) => [...prev, {
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            }]);
        });

        socket.current.on('typingStatus', (data) => {
            if (data.senderId === receiverId) {
                setIsTyping(true);
                setTimeout(() => setIsTyping(false), 3000);
            }
        });

        return () => {
            socket.current.disconnect();
        };
    }, [currentUser._id, receiverId]);

    useEffect(() => {
        fetchReceiver();
        fetchMessages();
    }, [receiverId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchReceiver = async () => {
        try {
            const { data } = await API.get(`/users/${receiverId}`);
            setReceiver(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMessages = async () => {
        const conversationId = [currentUser._id, receiverId].sort().join('_');
        try {
            const { data } = await API.get(`/messages/${conversationId}`);
            setMessages(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const conversationId = [currentUser._id, receiverId].sort().join('_');
        const messageData = {
            conversationId,
            receiverId,
            text: newMessage
        };

        socket.current.emit('sendMessage', {
            senderId: currentUser._id,
            receiverId,
            text: newMessage
        });

        try {
            const { data } = await API.post('/messages', messageData);
            setMessages((prev) => [...prev, data]);
            setNewMessage('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleKeyDown = () => {
        socket.current.emit('typing', {
            senderId: currentUser._id,
            receiverId
        });
    };

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 shadow-sm z-10 bg-white">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)}>
                        <ChevronLeft size={28} className="text-snapchat-blue" />
                    </button>
                    <div className="flex items-center gap-2">
                        <img 
                            src={receiver?.avatar || 'https://via.placeholder.com/40'} 
                            className="w-10 h-10 rounded-full object-cover"
                            alt=""
                        />
                        <div>
                            <h2 className="font-bold leading-tight">{receiver?.username || 'User'}</h2>
                            <span className="text-[10px] uppercase font-bold text-green-500">Active Now</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                        <Info size={20} />
                    </div>
                </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`flex ${msg.sender === currentUser._id ? 'justify-end' : 'justify-start'}`}
                        ref={scrollRef}
                    >
                        <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm font-medium shadow-sm ${
                            msg.sender === currentUser._id 
                                ? 'bg-snapchat-blue text-white rounded-br-none' 
                                : 'bg-white text-black border border-gray-100 rounded-bl-none'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 px-4 py-2 rounded-2xl rounded-bl-none text-xs italic text-gray-500">
                            {receiver?.username} is typing...
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-3 animate-slide-up">
                <div className="bg-gray-100 p-2 rounded-full">
                    <Camera size={22} className="text-gray-500" />
                </div>
                <form className="flex-1 flex items-center bg-gray-100 rounded-full px-4" onSubmit={handleSend}>
                    <input 
                        type="text" 
                        placeholder="Send a Chat" 
                        className="flex-1 bg-transparent py-3 text-sm outline-none"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button type="submit" className={newMessage.trim() ? 'text-snapchat-blue' : 'text-gray-300'}>
                        <Send size={20} />
                    </button>
                </form>
                <div className="flex items-center gap-3 text-gray-500">
                    <Mic size={22} />
                    <Image size={22} />
                </div>
            </div>
        </div>
    );
};

export default Conversation;

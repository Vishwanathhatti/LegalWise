import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../shared/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { useGetAllUserConversations } from '@/hooks/useGetAllUserConversations';
import { ArrowRight, MessageSquareIcon, PlusCircle } from 'lucide-react';
import { Logout } from './auth/Logout';
const ChatList = () => {
    useGetAllUserConversations();
    const allConversations = useSelector(store => store.conversation.allUserConversation);
    const sortedConversations = allConversations.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const user = useSelector(store => store.auth.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [open, setOpen] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
            ' ' +
            date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const handleCreateConversation = async (e) => {
        e.preventDefault();
        try {
            const formData = {
                title: title
            }
            const token = user.token;
            const response = await axios.post(
                `${import.meta.env.VITE_CONVERSATION_API_ENDPOINT}/create`, formData,
                {
                    headers: { authorization: token },
                    withCredentials: true,
                }
            )
            if (response.data.success === true) {
                toast.success(response.data.message);
                navigate(`/chat/${response.data.conversation._id}`);
                window.location.reload()
            }

            if (response.status === 401) {
                Logout(dispatch, navigate, user); // handle logout
            }

        } catch (error) {
            console.log(error)
            if (error.response.status === 401) {
                await Logout(dispatch, navigate, user); // handle logout
                return toast.error('Session expired. Please log in again.');
            }
            toast.error(error.response?.data?.message);
        }
    }


    return (
        <div className='w-full'>
            <Navbar />

            <div className='max-w-6xl mx-auto flex flex-col gap-5 justify-center items-center p-5'>
                <div className='w-full flex justify-between items-center flex-wrap gap-3'>
                    <div>
                        <h1 className=' text-3xl font-bold dark:text-white' >My Conversations</h1>
                        <p>View and continue your conversations.</p>
                    </div>

                    <div>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button><PlusCircle /> New Conversation</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create a New Conversation</DialogTitle>
                                </DialogHeader>
                                <Input
                                    type='text'
                                    placeholder='Enter conversation title'
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <Button className='mt-4' onClick={handleCreateConversation}>Create</Button>
                            </DialogContent>
                        </Dialog>
                    </div>

                </div>

                <div className='w-full flex flex-wrap justify-center p-3 gap-5 items-center'>
                    {sortedConversations && sortedConversations.length === 0 && (
                        <h1 className='w-full text-2xl font-bold text-center'>No Conversations Found</h1>
                    )}
                    {sortedConversations && sortedConversations.map((conversation) => (
                        <Link className='w-full flex bg-[#F1F5F9] dark:bg-[#292929] rounded-xl justify-between items-end border p-5' key={conversation._id} to={`/chat/${conversation._id}`}>
                            <div className='flex flex-col gap-3'>
                                <h1 className='text-2xl font-semibold flex items-center gap-2'><MessageSquareIcon /> {conversation.title}</h1>
                                <p>{formatDate(conversation.createdAt)}</p>
                            </div>

                            <Link to={`${conversation._id}`}>
                                <Button variant="link">
                                    Continue Conversation <ArrowRight />
                                </Button>
                            </Link>

                        </Link>
                    ))}
                </div>


            </div>



        </div>
    )
};

export default ChatList;
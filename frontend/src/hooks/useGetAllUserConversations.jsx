import { Logout } from '@/components/pages/auth/Logout';
import { setAllUserConversation } from '@/redux/conversationSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useGetAllUserConversations = () => {
    const user = useSelector(store => store.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = user?.token;
    useEffect(() => {
        const fetchAllUserConversations = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_CONVERSATION_API_ENDPOINT}/get`, { headers: { authorization: token }, withCredentials: true });
                if (response.data.success) {
                    dispatch(setAllUserConversation(response.data.allConversation));
                }
            } catch (error) {
                if (error.response.status === 401) {
                    await Logout(dispatch, navigate, user); // handle logout
                    return toast.error('Session expired. Please log in again.');
                }
                toast.error(error.response?.data?.message || error);
            }
        }
        fetchAllUserConversations();
    }, [])
}

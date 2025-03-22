import { setAllUserConversation } from '@/redux/conversationSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner';

export const useGetAllUserConversations = () => {
    const user = useSelector(store => store.auth.user);
    const dispatch = useDispatch();
    const token = user?.token;
    useEffect(() => {
        const fetchAllUserConversations = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/conversation/get', { headers: { authorization: token }, withCredentials: true });
                if (response.data.success) {
                    dispatch(setAllUserConversation(response.data.allConversation));
                }
            } catch (error) {
                toast.error(error.response?.data?.message || error);
            }
        }
        fetchAllUserConversations();
    }, [])
}

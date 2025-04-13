
import { setAllLikedPosts } from '@/redux/communityPostSlice';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

export const useGetAllLikedPosts = () => {
    const user = useSelector((store) => store.auth.user);
    const dispatch = useDispatch();
    
    useEffect(() => {
        if (!user?.token) return toast.error('User not authenticated'); // Prevent API call if token is missing
        const fetchAllLikedPosts = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_POST_API_ENDPOINT}/likes/get`,
                    {
                        headers: { authorization: user?.token },
                        withCredentials: true,
                    }
                );

                if (response.data.success) {
                    dispatch(setAllLikedPosts(response?.data?.likedPosts));
                }
            } catch (error) {
                toast.error(error?.response?.data?.message || 'Failed to fetch posts');
            }
        };

        fetchAllLikedPosts();
    }, [user, dispatch]);
};



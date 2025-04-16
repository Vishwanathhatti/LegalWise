
import { Logout } from '@/components/pages/auth/Logout';
import { setAllLikedPosts } from '@/redux/communityPostSlice';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useGetAllLikedPosts = () => {
    const user = useSelector((store) => store.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
                if (error.response.status === 401) {
                    await Logout(dispatch, navigate, user); // handle logout
                    return toast.error('Session expired. Please log in again.');
                }
                toast.error(error?.response?.data?.message || 'Failed to fetch posts');
            }
        };

        fetchAllLikedPosts();
    }, [user, dispatch]);
};



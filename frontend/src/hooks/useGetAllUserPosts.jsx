import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { setAllUserPosts } from '@/redux/communityPostSlice';
import { useNavigate } from 'react-router-dom';
import { Logout } from '@/components/pages/auth/Logout';

export const useGetAllUserPosts = () => {
    const user = useSelector(store => store.auth.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = user?.token;
    const userId = user?._id;

    useEffect(() => {
        if (!userId || !token) return; // Prevent API call if userId or token is missing

        const fetchAllUserPosts = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_POST_API_ENDPOINT}/get/${userId}`,
                    { headers: { authorization: token }, withCredentials: true }
                );

                if (response.data.success) {
                    dispatch(setAllUserPosts(response?.data?.userPosts));
                }
            } catch (error) {
                if (error.response.status === 401) {
                    await Logout(dispatch, navigate, user); // handle logout
                    return toast.error('Session expired. Please log in again.');
                }
                toast.error(error?.response?.data?.message || 'Failed to fetch posts');
            }
        };

        fetchAllUserPosts();
    }, []); 

};

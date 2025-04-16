import { Logout } from '@/components/pages/auth/Logout';
import { setAllUserComments } from '@/redux/communityCommentSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useGetAllUserComments = () => {
    const navigate = useNavigate()
    const user = useSelector(store => store.auth.user);
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllUserComments = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_COMMENT_API_ENDPOINT}/user-comments/${user?._id}`,
                    { headers: { authorization: user?.token }, withCredentials: true }
                );

                if (response.data.success) {
                    dispatch(setAllUserComments(response?.data?.userComments));

                }
            } catch (error) {
                if (error.response.status === 401) {
                    await Logout(dispatch, navigate, user); // handle logout
                    return toast.error('Session expired. Please log in again.');
                }
                toast.error(error?.response?.data?.message);
            }
        };

        fetchAllUserComments();
    }, [])
}

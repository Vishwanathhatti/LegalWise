import { setAllUserComments } from '@/redux/communityCommentSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

export const useGetAllUserComments = () => {
    const user = useSelector(store => store.auth.user);
    const dispatch = useDispatch();
    useEffect(()=>{
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
                console.log(error.response)
                toast.error(error?.response?.data?.message);
            }
        };

        fetchAllUserComments();
    },[])
}

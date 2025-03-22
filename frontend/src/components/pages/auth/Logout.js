import { setUser } from '@/redux/authSlice';
import { setAllUserConversation, setCurrentConversation } from '@/redux/conversationSlice';
import axios from 'axios';
import React from 'react'
import { toast } from 'sonner';

export const Logout = async(dispatch,navigate) => {
    try {
        const res = await axios.get(`http://localhost:5000/api/user/logout`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setUser(null));
          dispatch(setAllUserConversation(null))
          dispatch(setCurrentConversation(null))
          localStorage.removeItem("token");
          navigate("/login");
          toast.success(res.data?.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.res?.data?.message);
      }
}

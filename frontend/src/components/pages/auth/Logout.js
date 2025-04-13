import { resetAuth, setUser } from '@/redux/authSlice';
import { resetCommunityComment } from '@/redux/communityCommentSlice';
import { resetCommunityPost } from '@/redux/communityPostSlice';
import { resetConversation, setAllUserConversation, setCurrentConversation } from '@/redux/conversationSlice';
import axios from 'axios';
import React from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

export const Logout = async (dispatch, navigate, user) => {
  try {
    await axios.get(`${import.meta.env.VITE_USER_API_ENDPOINT}/logout`, {
      withCredentials: true,
      headers: {
        Authorization: user?.token,
      },
    });
  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message || "Logout request failed");
  } finally {
    // Always run this block, whether backend logout succeeds or fails

    dispatch(resetAuth());
    dispatch(resetConversation());
    dispatch(resetCommunityPost());
    dispatch(resetCommunityComment());


    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  }
};

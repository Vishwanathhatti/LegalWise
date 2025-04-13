import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setCurrentConversation } from "@/redux/conversationSlice";

const useGetCurrentConversation = (conversationId) => {
    const dispatch = useDispatch();
    const user = useSelector((store) => store.auth.user);
    const token = user?.token;

    useEffect(() => {
        if (!conversationId) return;

        const fetchCurrentConversation = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_CONVERSATION_API_ENDPOINT}/get/${conversationId}`,
                    {
                        headers: { authorization: token },
                        withCredentials: true,
                    }
                );
                if (response.data.success) {
                    dispatch(setCurrentConversation(response.data.conversation));
                }
            } catch (error) {
                toast.error(error.response?.data?.message || error.message);
            }
        };

        fetchCurrentConversation();
    }, [conversationId, dispatch, token]);

    // ✅ Always return something from a custom hook
    return null;
};

export default useGetCurrentConversation;

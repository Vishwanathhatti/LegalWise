import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
    name:"conversation",
    initialState:{
        allUserConversation:[],
        currentConversation:null,
    },
    reducers:{
        // actions

        setAllUserConversation:(state, action)=>{
            state.allUserConversation= action.payload;
        },
        setCurrentConversation:(state, action)=>{
            state.currentConversation= action.payload;
        }
    }
})

export const {setAllUserConversation, setCurrentConversation} = conversationSlice.actions;
export default conversationSlice.reducer;
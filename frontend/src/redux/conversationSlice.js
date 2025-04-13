import { createSlice } from "@reduxjs/toolkit";
const conversationSlice = createSlice({
    name: "conversation",
    initialState: {
      allUserConversation: [],
      currentConversation: null,
    },
    reducers: {
      setAllUserConversation: (state, action) => {
        state.allUserConversation = action.payload;
      },
      setCurrentConversation: (state, action) => {
        state.currentConversation = action.payload;
      },
      resetConversation: () => ({
        allUserConversation: [],
        currentConversation: null,
      }),
    },
  });
  
  export const { setAllUserConversation, setCurrentConversation, resetConversation } = conversationSlice.actions;
  export default conversationSlice.reducer;
  
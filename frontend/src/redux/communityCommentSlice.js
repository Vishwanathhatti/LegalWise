import { createSlice } from "@reduxjs/toolkit";
const communityCommentSlice = createSlice({
    name: "communityComment",
    initialState: {
      allUserComments: [],
      singlePostComments: [],
    },
    reducers: {
      setAllUserComments: (state, action) => {
        state.allUserComments = action.payload;
      },
      setSinglePostComments: (state, action) => {
        state.singlePostComments = action.payload;
      },
      resetCommunityComment: () => ({
        allUserComments: [],
        singlePostComments: [],
      }),
    },
  });
  
  export const {
    setAllUserComments,
    setSinglePostComments,
    resetCommunityComment
  } = communityCommentSlice.actions;
  export default communityCommentSlice.reducer;
  
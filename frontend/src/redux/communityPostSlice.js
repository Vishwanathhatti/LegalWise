import { createSlice } from "@reduxjs/toolkit";
const communityPostSlice = createSlice({
    name: "communityPost",
    initialState: {
      allPosts: [],
      allUserPosts: [],
      allLikedPosts: [],
      trendingPosts: [],
      singlePost: null,
      searchedPosts: [],
    },
    reducers: {
      setAllPosts: (state, action) => {
        state.allPosts = action.payload;
      },
      setAllUserPosts: (state, action) => {
        state.allUserPosts = action.payload;
      },
      setAllLikedPosts: (state, action) => {
        state.allLikedPosts = action.payload;
      },
      setTrendingPosts: (state, action) => {
        state.trendingPosts = action.payload;
      },
      setSinglePost: (state, action) => {
        state.singlePost = action.payload;
      },
      setSearchedPosts: (state, action) => {
        state.searchedPosts = action.payload;
      },
      resetCommunityPost: () => ({
        allPosts: [],
        allUserPosts: [],
        allLikedPosts: [],
        trendingPosts: [],
        singlePost: null,
        searchedPosts: [],
      }),
    },
  });
  
  export const {
    setAllPosts,
    setAllLikedPosts,
    setAllUserPosts,
    setTrendingPosts,
    setSinglePost,
    setSearchedPosts,
    resetCommunityPost
  } = communityPostSlice.actions;
  export default communityPostSlice.reducer;
  
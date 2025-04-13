import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
    name: "auth",
    initialState: {
      loading: false,
      user: null,
    },
    reducers: {
      setLoading: (state, action) => {
        state.loading = action.payload;
      },
      setUser: (state, action) => {
        state.user = action.payload;
      },
      resetAuth: () => ({
        loading: false,
        user: null,
      }),
    },
  });
  
  export const { setLoading, setUser, resetAuth } = authSlice.actions;
  export default authSlice.reducer;
  
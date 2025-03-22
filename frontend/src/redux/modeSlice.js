import { createSlice } from "@reduxjs/toolkit";

const modeSlice = createSlice({
    name:"mode",
    initialState:{
        darkmode:false,
    },
    reducers:{
        // actions
        setDarkmode:(state, action) =>{
            state.darkmode= action.payload;
        },
    }
})

export const {setDarkmode} = modeSlice.actions;
export default modeSlice.reducer;
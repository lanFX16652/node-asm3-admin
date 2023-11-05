import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload?.user ? action.payload.user : null
        }
    }
})

//Select state currentUser from slice
export const selectUser = (state) => state.user.user;

//export Action
export const { setUser } = userSlice.actions;

//export Reducer
const userReducer = userSlice.reducer;

export default userReducer;
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import meetingReducer from "../features/meetings/meetingSlice";
import userReducer from "../features/users/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    meeting: meetingReducer,
    user: userReducer,
  },
});

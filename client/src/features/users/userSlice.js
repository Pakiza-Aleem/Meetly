import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (formData, thunkAPI) => {
    try {
      const { data } = await api.put("/users/profile", formData);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: { profile: null, status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;

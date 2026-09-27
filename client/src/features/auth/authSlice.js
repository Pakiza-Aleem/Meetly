import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

const storedUser = JSON.parse(localStorage.getItem("Meetly_user") || "null");

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, thunkAPI) => {
    try {
      const { data } = await api.post("/auth/register", formData);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, thunkAPI) => {
    try {
      const { data } = await api.post("/auth/login", formData);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/auth/me");
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Session expired");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser,
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("Meetly_token");
      localStorage.removeItem("Meetly_user");
    },
  },
  extraReducers: (builder) => {
    const persist = (state, action) => {
      state.status = "succeeded";
      state.user = action.payload;
      localStorage.setItem("Meetly_token", action.payload.token);
      localStorage.setItem("Meetly_user", JSON.stringify(action.payload));
    };

    builder
      .addCase(registerUser.pending, (state) => { state.status = "loading"; })
      .addCase(registerUser.fulfilled, persist)
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => { state.status = "loading"; })
      .addCase(loginUser.fulfilled, persist)
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.user = null;
        localStorage.removeItem("Meetly_token");
        localStorage.removeItem("Meetly_user");
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

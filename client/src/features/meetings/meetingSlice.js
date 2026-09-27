import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const createMeeting = createAsyncThunk(
  "meeting/createMeeting",
  async (title, thunkAPI) => {
    try {
      const { data } = await api.post("/meetings", { title });
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Could not create meeting");
    }
  }
);

export const getMeetings = createAsyncThunk(
  "meeting/getMeetings",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/meetings");
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Could not load meetings");
    }
  }
);

export const getMeeting = createAsyncThunk(
  "meeting/getMeeting",
  async (roomId, thunkAPI) => {
    try {
      const { data } = await api.get(`/meetings/${roomId}`);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Meeting not found");
    }
  }
);

export const uploadFile = createAsyncThunk(
  "meeting/uploadFile",
  async ({ file, meetingId }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("meetingId", meetingId);
      const { data } = await api.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Upload failed");
    }
  }
);

const meetingSlice = createSlice({
  name: "meeting",
  initialState: {
    meetings: [],       // recent meetings for the dashboard
    currentMeeting: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearCurrentMeeting: (state) => {
      state.currentMeeting = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMeeting.fulfilled, (state, action) => {
        state.meetings.unshift(action.payload);
        state.currentMeeting = action.payload;
      })
      .addCase(getMeetings.pending, (state) => { state.status = "loading"; })
      .addCase(getMeetings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.meetings = action.payload;
      })
      .addCase(getMeetings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getMeeting.pending, (state) => { state.status = "loading"; })
      .addCase(getMeeting.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentMeeting = action.payload;
      })
      .addCase(getMeeting.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearCurrentMeeting } = meetingSlice.actions;
export default meetingSlice.reducer;

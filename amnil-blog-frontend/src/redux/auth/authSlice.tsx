import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../../services/auth.service";

interface IInitialState {
  token: string | null;
  user: {
    _id: string;
    name: string;
    email: string;
    userType: string,
    status: string,
    image: string
  } | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: IInitialState = {
  token: null,
  user: null,
  status: "idle",
};

export const fetchUser = createAsyncThunk("User/fetchUser", async () => {
  const response =  await authService.getRequest("auth/me");
  return response;
  console.log('response: ', response);
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.status = "idle";
      localStorage.removeItem("amnilBlogToken");
    },
    setToken(state, action){
      state.token = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.user = action.payload.data;
      state.status = "succeeded";
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      console.log("error fetching user from auth reducer");
      state.status = "failed";
    });
  },
});

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;

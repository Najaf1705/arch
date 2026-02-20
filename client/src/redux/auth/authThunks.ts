import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import { setUser } from "../user/userSlice";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    const res = await fetch(
      `${import.meta.env.VITE_APP_BACKEND_URL}/auth/login/local`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return rejectWithValue(err || "Login failed");
    }

    // even if backend only sets cookie — still return something
    return { success: true };
  }
);


export const registerThunk = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }: any) => {
    const res = await fetch(
      `${import.meta.env.VITE_APP_BACKEND_URL}/auth/register/local`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({name, email, password }),
      }
    );

    if(res.ok)return await res.json();

    if (!res.ok) throw new Error("Registration failed");
  }
);



export const googleLoginThunk = createAsyncThunk(
  "auth/google",
  async (
    { idToken, password }: { idToken: string, password: string | null },
    { rejectWithValue }
  ) => {
    const res = await fetch(
      `${import.meta.env.VITE_APP_BACKEND_URL}/auth/google`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, password }),
      }
    );

    // ---- CASE 1: Existing user (logged in) ----
    if (res.status === 200) {
      // No body to parse
      return { status: "EXISTS" as const };
    }

    // ---- CASE 2: New Google user ----
    if (res.status === 202) {
      const data = await res.json(); // safe: backend sends JSON
      return {
        status: "NEW_USER" as const,
        email: data.email
      };
    }

    // ---- Anything else is a real error ----
    return rejectWithValue("Google auth failed");
  }
);


export const verifyRegisterOtpThunk = createAsyncThunk<
  void,
  { otpRequestId: string; otp: string; email: string },
  { rejectValue: "USER_NOT_FOUND" | "INVALID_OTP" }
>(
  "auth/otpVerify",
  async ({ otpRequestId, otp, email }, { rejectWithValue }) => {
    const res = await fetch(
      `${import.meta.env.VITE_APP_BACKEND_URL}/auth/login/verify-otp`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otpRequestId, otp, email }),
      }
    );

    if (res.status === 200) {
      return;
    }

    if (res.status === 404) {
      return rejectWithValue("USER_NOT_FOUND");
    }

    return rejectWithValue("INVALID_OTP");
  }
);



export const verifyLoginOtpThunk = createAsyncThunk<
  void,
  { otpRequestId: string; otp: string; email: string },
  { rejectValue: "USER_NOT_FOUND" | "INVALID_OTP" }
>(
  "auth/otpVerify",
  async ({ otpRequestId, otp, email }, { rejectWithValue }) => {
    const res = await fetch(
      `${import.meta.env.VITE_APP_BACKEND_URL}/auth/login/verify-otp`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otpRequestId, otp, email }),
      }
    );

    if (res.status === 200) {
      return;
    }

    if (res.status === 404) {
      return rejectWithValue("USER_NOT_FOUND");
    }

    return rejectWithValue("INVALID_OTP");
  }
);



export const regenerateOtpThunk=createAsyncThunk(
  "auth/regenerateOtp",
  async({otpRequestId}:{otpRequestId:string},{rejectWithValue})=>{
    const res=await fetch(
      `${import.meta.env.VITE_APP_BACKEND_URL}/auth/regenerate-otp`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otpRequestId }),
      }
    )
    
    if(res.status===200){
      return {
        otpGenerated: true
      }
    }

    return rejectWithValue("Failed to regenerate OTP");
  }
);
export const generateOtp=createAsyncThunk(
  "auth/rgenerateOtp",
  async({email}:{email:string},{rejectWithValue})=>{
    const res=await fetch(
      `${import.meta.env.VITE_APP_BACKEND_URL}/auth/generate-otp`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    )
    
    if(res.status===200){
      const result=await res.json();
      return {
        otpRequestId: result.otpRequestId
      }
    }

    return rejectWithValue("Failed to regenerate OTP");
  }
);




export const fetchMe = createAsyncThunk(
  "auth/me",
  async () => {
    const res = await fetch(
      `${import.meta.env.VITE_APP_BACKEND_URL}/auth/me`,
      { credentials: "include" }
    );

    if (!res.ok) throw new Error("Not logged in");

    return await res.json(); // ✅ return payload
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Logout failed");
      }

      // Clear user state by refetching /me (which should now return 401 / null)
      dispatch(fetchMe());

      return true;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

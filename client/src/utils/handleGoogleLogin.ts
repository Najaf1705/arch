import { type NavigateFunction } from "react-router-dom";
import { fetchMe, googleLoginThunk } from "../redux/auth/authThunks";
import type { CredentialResponse } from "@react-oauth/google";
import type { AppDispatch } from "../redux/store";

type SetLoading = (v: boolean) => void;

export async function handleGoogleLogin(
  cred: CredentialResponse,
  dispatch: AppDispatch,
  navigate: NavigateFunction,
  setLoading: SetLoading
) {
  if (!cred.credential) return;

  try {
    setLoading(true);

    const result = await dispatch(
      googleLoginThunk({
        idToken: cred.credential,
        password: null,
      })
    ).unwrap();

    if (result.status === "EXISTS") {
      await dispatch(fetchMe()).unwrap();
      navigate("/profile");
      return;
    }

    if (result.status === "NEW_USER") {
      navigate("/setPass", {
        state: {
          idToken: cred.credential,
          email: result.email,
        },
      });
      return;
    }

    throw new Error("Unexpected response");

  } catch (err) {
    console.error("Google login failed", err);
    alert("Google login failed");
  } finally {
    setLoading(false);
  }
}
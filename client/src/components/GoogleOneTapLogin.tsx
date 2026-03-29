import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { fetchMe, googleLoginThunk } from "../redux/auth/authThunks";
import { useAppSelector } from "../redux/hooks";
import { useNavigate } from "react-router-dom";


declare global {
  interface Window {
    google: any;
  }
}

const GoogleOneTap = () => {
  console.log("GoogleOneTap mounted");
  const navigate=useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const initialized = useRef(false);
  const authenticationStatus = useAppSelector(
    (state) => state.auth.status
  );

   useEffect(() => {
    // ❌ Don't run until auth check is done
    if (authenticationStatus === "idle" || authenticationStatus === "loading") return;

    // ❌ Don't show if already logged in
    if (authenticationStatus === "authenticated") return;

    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      use_fedcm_for_prompt: true,
      auto_select: false,
    });

    window.google.accounts.id.prompt();

  }, [authenticationStatus]);


  const handleCredentialResponse = async (response: any) => {
    try {
      const idToken = response.credential;

      const result = await dispatch(
        googleLoginThunk({ idToken, password: null })
      );

      if (googleLoginThunk.fulfilled.match(result)) {
        if (result.payload.status === "EXISTS") {
          console.log("✅ User logged in");
          dispatch(fetchMe());
        } else if (result.payload.status === "NEW_USER") {
          console.log("➡️ Redirect to signup", result.payload.email);
          navigate('/register');
        }
      } else {
        console.error("❌ Google login failed");
      }
    } catch (err) {
      console.error("❌ Error handling Google response", err);
    }
  };

  return null;
};

export default GoogleOneTap;
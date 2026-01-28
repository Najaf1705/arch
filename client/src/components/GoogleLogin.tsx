import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux/hooks";
import { setUser } from "../redux/user/userSlice";

export default function GoogleLoginButton() {
  const navigate = useNavigate();
  const dispatch=useAppDispatch();

  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id:
        "585962886488-jmg1kq13knme75u27r5ij8pe2jt2fgmt.apps.googleusercontent.com",
      callback: handleGoogleResponse,
    });

    const btn = document.getElementById("googleBtn");
    if (btn) {
      window.google.accounts.id.renderButton(btn, {
        theme: "outline",
        size: "large",
      });
    }
  }, []);

  async function handleGoogleResponse(
    response: { credential: string }
  ) {
    const res = await fetch(
      "http://localhost:8080/auth/login/google",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          idToken: response.credential,
        }),
      }
    );

    const data = await res.json();
    // console.log(data);

    // ✅ EXISTING USER → logged in
    if (data.userExists) {
      console.log("user exists");
      dispatch(setUser(data));
      navigate("/profile", { replace: true });
      return;
    }

    // 🆕 NEW USER → go to password page
    navigate("/set-password", {
      state: {
        idToken: response.credential,
      },
    });
  }

  return <div id="googleBtn"></div>;
}

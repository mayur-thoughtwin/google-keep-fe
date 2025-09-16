import { useCallback } from "react";
import googleConfig from "../config/googleAuth";
import { useNavigate } from "react-router-dom";

export function useGoogleAuth() {
  const navigate = useNavigate();

  const login = useCallback(() => {
    const authUrl = `${googleConfig.authEndpoint}?client_id=${googleConfig.clientId}&redirect_uri=${googleConfig.redirectUri}&response_type=${googleConfig.responseType}&scope=${encodeURIComponent(googleConfig.scope)}`;
    window.location.href = authUrl;
  }, []);
  // Handle OAuth callback
  const handleCallback = useCallback(() => {

    const token = new URLSearchParams(window.location.search).get("token");
    console.log("OAuth token:", token);
    if (token) {
      localStorage.setItem("google_token", token);
      // navigate("/welcome");
    }
  }, [navigate]);

  return { login, handleCallback };
}
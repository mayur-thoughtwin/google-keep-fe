const GOOGLE_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
  redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
  scopes: import.meta.env.VITE_GOOGLE_SCOPES.split(" ")
};

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

export default {
  authEndpoint: GOOGLE_AUTH_URL,
  clientId: GOOGLE_CONFIG.clientId,
  redirectUri: GOOGLE_CONFIG.redirectUri,
  scope: GOOGLE_CONFIG.scopes.join(" "),
  responseType: "code" // if using authorization code flow
};

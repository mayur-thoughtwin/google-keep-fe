import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Welcome from "../pages/Home";

function AppRoute(props) {
  const isAuthenticated = localStorage.getItem("google_token");

  return (
    <Router {...props}>
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/welcome" replace /> : <LoginPage />} 
        />
        <Route 
          path="/welcome/*" 
          element={isAuthenticated ? <Welcome /> : <Navigate to="/" replace />} 
        />
      </Routes>
    </Router>
  );
}
export default AppRoute;

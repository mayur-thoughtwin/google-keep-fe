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

  return (
    <Router {...props}>
      <Routes>
        <Route 
          path="/" 
          element={<LoginPage />} 
        />
        <Route 
          path="/home/*" 
          element={ <Welcome /> } 
        />
        
      </Routes>
    </Router>
  );
}
export default AppRoute;

import React from "react";
import { Outlet, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Notes from "./Notes";
import Reminders from "./Reminders";
import Archive from "./Archive";
import Trash from "./Trash";
import Settings from "./Settings";

export default function Welcome() {
  const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    // extract token from url
    const token = queryParams.get("token");
    if (token) {
        localStorage.setItem("google_token", token);
        window.history.replaceState({}, document.title, "/");
    }

  return (
    <Routes>
      <Route index element={<Navigate to="notes" replace />} />
      <Route path="notes" element={<Notes />} />
      <Route path="reminders" element={<Reminders />} />
      <Route path="archive" element={<Archive />} />
      <Route path="trash" element={<Trash />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  );
}
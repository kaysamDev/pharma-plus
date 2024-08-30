import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login.tsx";
import Register from "./Register.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Login should be the first page */}
        <Route path="/login" element={<Login />} index={true} />
        <Route path="/register" element={<Register />} />

        {/* Protect routes that require authentication */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<App />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

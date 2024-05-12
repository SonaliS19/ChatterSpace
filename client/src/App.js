import { BrowserRouter, Route, Routes } from "react-router-dom";

import Chat from "./pages/Chat";
import Login from "./pages/Login";
import React from "react";
import Register from "./pages/Register";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Chat />} />
            </Routes>
        </BrowserRouter>
    );
}

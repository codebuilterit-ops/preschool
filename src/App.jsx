import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Users/Pages/Home";
import LoginPage from "./vendor/Pages/LoginPage";
import SignUpPage from "./vendor/Pages/SignUpPage";
import Profile from "./vendor/Pages/Profile";
import Gallery from "./vendor/Pages/Gallery";
import PreSchool from "./Users/Pages/PreSchool";
import VisitorProfile from "./Users/Pages/VisitorProfile";
import AllImages from "./Users/Pages/AllImages";
import AdminLogin from "./Admin/Pages/AdminLogin";
import AdminDashBoard from "./Admin/Pages/AdminDashBoard";
import AllAccounts from "./Admin/Pages/AllAccounts";
import AllYouTube from "./Admin/Pages/AllYouTube";

export const BACKEND_URL = import.meta.env.VITE_API_URL;

function App() {
  return (
    <Routes>
      {/* User */}
      <Route path="/" element={<Home />} />
      <Route path="/preschool" element={<PreSchool />} />
      <Route path="/preschool/:preschoolId" element={<VisitorProfile />} />
      <Route path="/preschool/:preschoolId/photos" element={<AllImages />} />
      <Route path="/allimages" element={<AllImages />} />
      {/* Vendor Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/gallery/:folderId" element={<Gallery />} />
      <Route path="/gallery/:preschoolId/:folderId" element={<Gallery />} />

      {/*-------------------------admin--------------- */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashBoard />} />
      <Route path="/admin/youtube" element={<AllYouTube />} />
      <Route path="/admin/all-accounts" element={<AllAccounts />} />
    </Routes>
  );
}

export default App;

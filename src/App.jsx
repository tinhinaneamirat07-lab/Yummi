import { BrowserRouter, Routes, Route } from "react-router-dom";

// components
import Navbar from "./components/Navbar/Navbar";
import Recipes from "./components/Recipes/Recipes";
import Footer from "./components/Footer/Footer";
import CookingTips from "./components/CookingTips/CookingTips";
import CallToAction from "./components/CallToAction/CallToAction";
import Planner from "./components/planner/Planner";

// pages

import Profile from "./pages/Profile/Profile";
import Auth from "./pages/Auth/AuthModal";


import "./App.css";
import Hero from "./components/Hero/Hero";
function App() {
  return (
    <BrowserRouter>
      {/* Navbar دايمًا */}
      <Navbar />

      <Routes>
        {/* HOME */}
        <Route
          path="/"
          element={
            <>
              <Hero/>
              <CookingTips />
              <Recipes />
              <CallToAction />
              <Footer />
            </>
          }
        />

        {/* AUTH */}
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />

       

        {/* OTHERS */}
        <Route path="/planner" element={<Planner />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

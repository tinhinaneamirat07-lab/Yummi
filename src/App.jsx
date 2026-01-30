import { BrowserRouter, Routes, Route } from "react-router-dom";
// components
import Hero from "./components/Hero/Hero";
import Navbar from "./components/navbar/Navbar";
import CookingTips from "./components/CookingTips/CookingTips";
import CallToAction from "./components/CallToAction/CallToAction";
import Footer from "./components/footer/Footer";
import Planner from "./components/planner/Planner";
import Recipes from "./components/recipes/Recipes";






// pages
import Auth from "./pages/Auth/AuthModal";
import Profile from "./pages/Profile/Profile";






import "./App.css";

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
              <CookingTips/>
              <Recipes />
              <CallToAction />
              <Footer/>
            </>
          }
        />

        {/* AUTH */}
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />

       

        {/* OTHERS */}
        <Route path="/planner" element={<Planner/>} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import Exchanger from "./pages/exchanger/Exchanger.jsx";
import Register from "./pages/register/Register.jsx";
import Login from "./pages/login/Login.jsx";
import UserProfile from "./pages/user_profile/UserProfile.jsx";
import AboutApp from "./pages/about_app/AboutApp.jsx";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exchanger" element={<Exchanger />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user_profile" element={<UserProfile />} />
        <Route path="/about_app" element={<AboutApp />} />
      </Routes>
    </Router>
  );
}

export default App

import { Link } from "react-router-dom";
import "./styles/Home.css";
import Cookies from 'js-cookie';


const getAuthData = () => {
    return Cookies.get("token");
};



export default function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Головна сторінка</h1>
      <nav className="home-nav">
        <Link to="/exchanger" className="home-button">Обмінник</Link>
        <Link to="/register" className="home-button">Реєстрація</Link>
        <Link to="/login" className="home-button green">Вхід</Link>
        {getAuthData() && <Link to="/user_profile" className="home-button">Профіль</Link>}
        <Link to="/about_app" className="home-button gray">Про додаток</Link>
      </nav>
    </div>
  );
}

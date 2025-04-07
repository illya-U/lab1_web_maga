import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {setAuthData} from "../../common/AuthService";
import "./styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const host = import.meta.env.VITE_DJANGO_HOST;

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
    setPasswordError(e.target.value.length < 8 ? "Пароль має містити мінімум 8 символів" : "");
  };

  const LoginFunction = () => {
    if (password.length < 8 || !email) return

    fetch(`${host}login/`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(
        { 
          "email": email, 
          "password": password 
        }
      ),
    })
    .then((response) =>{
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.error || 'Помилка авторизації');
        });
      }
      return response.json();
    }
    )
    .then((response) => {
      localStorage.setItem('isAuthenticated', 'true');
      setAuthData(response);
      navigate("../exchanger")
    })
    .catch((error) => {
      console.error("Loading error:", error);
      alert("Данні для авторизації введені невірно");
    });
  }

  return (
    <div className="login-container">
      <h2>Вхід</h2>
      <form className="login-form">
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handleChangePassword}
            placeholder="Введіть пароль"
            className="password-input"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="password-toggle"
            style={{
              top: passwordError ? "25%" : "50%"
            }}
          >
            {showPassword ? "👁️" : "🙈"}
          </button>
          {passwordError && <p className="password-error">{passwordError}</p>}
        </div>
        <button type="button" className="login-button" onClick={LoginFunction}>
          Увійти
        </button>
      </form>
    </div>
  );
}
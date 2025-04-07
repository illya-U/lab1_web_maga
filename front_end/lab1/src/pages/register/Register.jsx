import { useState} from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Register.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("M");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const host = import.meta.env.VITE_DJANGO_HOST;

  const handleChangePassword = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(value.length < 8 ? "Пароль повинен бути мінімум 8 символів" : "");
  };


  const handleRegister = (e) => {
    e.preventDefault();
    if (!name || !email || !gender || !date || password.length < 8) return;

    fetch(`${host}register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        { 
          "username": name, 
          "email": email, 
          "password": password, 
          "gender": gender, 
          "birth_date": date 
        }
      ),
    })
    .then((response) => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.error || 'Помилка аунтефікації');
        });
      }
      return response.json();
    })
      .then(() => navigate("../login"))
      .catch((error) => {
        console.error("Loading error:", error);
        alert("Данні для регістрації введені невірно");
      });
  };

  return (
    <div className="register-container">
      <h2>Реєстрація</h2>
      <form className="register-form">
        <input 
          type="text"
          placeholder="Ім’я"
          onChange={(e) => setName(e.target.value)} 
        />
        <input
          // make here validation if needed
          type="email"
          placeholder="Email"
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

        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="M">Чоловік</option>
          <option value="F">Жінка</option>
          <option value="O">Інше</option>
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <button type="button" className="submit-button" onClick={handleRegister}>
          Зареєструватися
        </button>
      </form>
    </div>
  );
}

// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/login", {
        username,
        password
      });
      localStorage.setItem("user", JSON.stringify(res.data));
      res.data.role === "admin" ? navigate("/admin") : navigate("/calculator");
    } catch (err) {
      alert("Giriş başarısız!");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh"
    }}>
      <form onSubmit={handleSubmit} style={{
        background: "#f5f5f5",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}>
        <h3>Giriş Yap</h3>
        <input 
          type="text" 
          placeholder="Kullanıcı Adı" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          style={inputStyle}
        />
        <input 
          type="password" 
          placeholder="Şifre" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Giriş</button>
      </form>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "0.8rem",
  margin: "1rem 0",
  borderRadius: "4px",
  border: "1px solid #ddd"
};

const buttonStyle = {
  width: "100%",
  padding: "0.8rem",
  background: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};

export default Login;
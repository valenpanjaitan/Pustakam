import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(form.username, form.password);
    navigate("/books");
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
      <span className="eyebrow">Senang melihatmu kembali</span>
      <h1>Masuk ke Ruang Baca</h1>
      <p>Kelola koleksi dan lanjutkan perjalanan membacamu.</p>

      <form onSubmit={handleSubmit}>
        <div className="field"><label htmlFor="username">Nama pengguna</label>
          <input
            id="username"
            type="text"
            placeholder="Nama pengguna"
            autoComplete="username"
            required
            value={form.username}
            onChange={(e) => setForm({...form, username: e.target.value})}
          />
        </div>
        <div className="field"><label htmlFor="password">Kata sandi</label>
          <input
            id="password"
            type="password"
            placeholder="Kata sandi"
            autoComplete="current-password"
            required
            value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})}
          />
        </div>
        <button className="button" type="submit">Masuk</button>
      </form>
      <p style={{ marginTop: 18 }}>Kembali ke <Link className="section-link" to="/">beranda</Link></p>
      </div>
    </div>
  );
}

export default Login;

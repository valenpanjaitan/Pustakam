import { useContext } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Books from "./pages/Books";
import BookDetail from "./pages/BookDetail";
import BooksLayout from "./pages/BooksLayout";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthContext from "./context/AuthContext";

function Storefront() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="site-shell">
      <div className="top-strip">A little more reading, a lot more wonder</div>
      <header className="site-header">
        <div className="header-inner">
          <div className="brand-row">
            <Link className="brand" to="/">Pustakam<small>temukan cerita berikutnya</small></Link>
            <label className="search-box" aria-label="Search books"><span>⌕</span><input placeholder="Cari judul buku atau penulis" onKeyDown={(event) => event.key === "Enter" && navigate("/books")} /></label>
            <div className="header-actions">
              <Link to="/">Beranda</Link>
              {isAuthenticated ? <><Link to="/books">Koleksi buku</Link><button onClick={logout}>Keluar</button></> : <Link to="/login">Masuk</Link>}
            </div>
          </div>
          <div className="mobile-search"><label className="search-box" aria-label="Search books"><span>⌕</span><input placeholder="Cari judul buku atau penulis" onKeyDown={(event) => event.key === "Enter" && navigate("/books")} /></label></div>
        </div>
      </header>
      <main><Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<ProtectedRoute><BooksLayout /></ProtectedRoute>}>
          <Route index element={<Books />} />
          <Route path=":id" element={<BookDetail />} />
        </Route>
      </Routes></main>
      <footer className="site-footer"><div className="footer-inner"><div><div className="footer-brand">Ruang Baca</div><p className="footer-copy">Ruang kecil untuk cerita-cerita besar.</p></div><div className="footer-links"><Link to="/">Tentang kami</Link><Link to="/books">Jelajahi koleksi</Link><Link to="/login">Akun pembaca</Link></div></div></footer>
    </div>
  );
}

function App() {
  return <BrowserRouter><Storefront /></BrowserRouter>;
}

export default App;

import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Ruang untuk cerita baru</span>
          <h1>Temukan buku yang terasa seperti rumah.</h1>
          <p>Dari kisah yang membuatmu lupa waktu hingga ide yang membuka cara pandang baru—semua cerita baik dimulai dari satu halaman.</p>
          <Link className="button" to="/books">Jelajahi koleksi <span aria-hidden="true">→</span></Link>
        </div>
        <div className="hero-art" aria-hidden="true"><div className="hero-orb" /><div className="book-stack"><div className="book-shape one">Kisah<br />yang pulang</div><div className="book-shape two">Halaman<br />baru</div><div className="book-shape three">Ruang<br />untuk tumbuh</div></div></div>
        <span className="hero-note">Buka. Baca. Temukan.</span>
      </section>

      <div className="benefit-row">
        <div className="benefit"><span className="benefit-icon">✳</span><span>Koleksi pilihan untuk setiap rasa ingin tahu</span></div>
        <div className="benefit"><span className="benefit-icon">♡</span><span>Simpan dan kelola daftar bacaanmu</span></div>
        <div className="benefit"><span className="benefit-icon">↗</span><span>Selalu ada cerita yang menunggu ditemukan</span></div>
      </div>

      <section className="collection-panel"><div><span className="eyebrow">Koleksi pribadimu</span><h2>Atur rak bacaanmu sendiri.</h2><p>Tambahkan buku, catat penulis, dan simpan tanggal terbitnya dalam satu tempat.</p></div><Link className="button button-outline" to="/books">Buka koleksi <span aria-hidden="true">→</span></Link></section>
    </div>
  );
}

export default Home;

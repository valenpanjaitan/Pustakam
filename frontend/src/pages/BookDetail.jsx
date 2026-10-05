import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

function BookDetail() {
  const { id } = useParams();

  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      const response = await api.get(`/api/buku/${id}/`);
      setBook(response.data);
    }
    fetchBook();
  }, [id]);

  if (!book) {
    return <div className="loading">Memuat detail buku…</div>;
  }

  return (
    <div className="page-wrap">
      <div className="breadcrumbs"><Link to="/">Beranda</Link><span>›</span><Link to="/books">Koleksi buku</Link><span>›</span><span>Detail</span></div>
      <article className="detail-card"><div className="detail-cover" aria-hidden="true">{book.title}</div><div className="detail-copy"><span className="eyebrow">Detail koleksi</span><h1>{book.title}</h1><p>Penulis · {book.writer}</p><p>Tanggal terbit · {book.issued_date}</p><p style={{ marginTop: 25 }}><Link className="button button-outline" to="/books">← Kembali ke koleksi</Link></p></div><div style={{ clear: "both" }} /></article>
    </div>
  );
}

export default BookDetail;

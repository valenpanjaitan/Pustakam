import { useEffect, useState } from "react";
import api from "../api/axios";

import BookForm from "../components/BookForm";
import BookList from "../components/BookList";

function Books() {
  const [buku, setBuku] = useState([]);

  const [form, setForm] = useState({
    title: "",
    writer: "",
    issued_date: "",
  });

  const [editId, setEditId] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api
      .get("/api/buku/")
      .then((response) => {
        setBuku(response.data);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editId !== null
      ? `/api/buku/${editId}/`
      : "/api/buku/";

    const method = editId ? "patch" : "post";

    const response = await api[method](url, form);
    const data = response.data;

    if (editId !== null) {
      setBuku(
        buku.map((item) => 
        item.id === editId ? data : item
        )
      );
    } else {
      setBuku([data, ...buku]);
    }

    setForm({
      title: "",
      writer: "",
      issued_date: "",
    });

    setEditId(null);

  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      title: item.title,
      writer: item.writer,
      issued_date: item.issued_date,
    })
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this book?");
    if (!confirmDelete) {
      return;
    }
    await api.delete(
      `/api/buku/${id}/`
    );
    setBuku(
      buku.filter((item) => item.id !== id)
    );
  };

  const filteredBuku = buku.filter((item) =>
    `${item.title} ${item.writer}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="page-wrap">
      <div className="breadcrumbs"><a href="/">Beranda</a><span>›</span><span>Koleksi buku</span></div>
      <h1 className="page-title">Koleksi buku</h1>
      <p className="page-intro">Satu tempat untuk mengatur semua cerita favoritmu.</p>

      <div className="management-layout">
      <BookForm
        form={form}
        editId={editId}
        onChange={setForm}
        onSubmit={handleSubmit}
      />

      <section>
        <div className="section-heading"><div><h2>Rak bacaan</h2><p>{buku.length} {buku.length === 1 ? "buku" : "buku"} dalam koleksimu</p></div><label className="search-box"><span>⌕</span><input aria-label="Cari koleksi" placeholder="Cari judul atau penulis" value={query} onChange={(event) => setQuery(event.target.value)} /></label></div>
        <BookList buku={filteredBuku} onEdit={handleEdit} onDelete={handleDelete} />
      </section>
      </div>

    </div>
  );
}

export default Books;

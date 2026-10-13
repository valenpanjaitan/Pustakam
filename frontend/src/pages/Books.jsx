import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";

import BookForm from "../components/BookForm";
import BookList from "../components/BookList";

const PAGE_SIZE = 10;

function Books() {
  const [buku, setBuku] = useState([]);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [form, setForm] = useState({
    title: "",
    writer: "",
    issued_date: "",
  });
  const [editId, setEditId] = useState(null);
  const [query, setQuery] = useState("");

  const loadBooks = useCallback(async (pageNumber) => {
    setLoading(true);
    setLoadError(false);

    try {
      const response = await api.get("/api/buku/", {
        params: { page: pageNumber },
      });
      setBuku(response.data.results);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks(page);
  }, [loadBooks, page]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId !== null) {
      const response = await api.patch(`/api/buku/${editId}/`, form);
      setBuku((currentBooks) =>
        currentBooks.map((item) => item.id === editId ? response.data : item)
      );
    } else {
      await api.post("/api/buku/", form);
      if (page === 1) {
        await loadBooks(1);
      } else {
        setPage(1);
      }
    }

    setForm({ title: "", writer: "", issued_date: "" });
    setEditId(null);
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      title: item.title,
      writer: item.writer,
      issued_date: item.issued_date,
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this book?");
    if (!confirmDelete) return;

    await api.delete(`/api/buku/${id}/`);
    if (page > 1 && buku.length === 1) {
      setPage((currentPage) => currentPage - 1);
    } else {
      await loadBooks(page);
    }
  };

  const filteredBuku = buku.filter((item) =>
    `${item.title} ${item.writer ?? ""}`.toLowerCase().includes(query.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(pagination.count / PAGE_SIZE));

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
          <div className="section-heading">
            <div>
              <h2>Rak bacaan</h2>
              <p>{pagination.count} buku · Halaman {page} dari {totalPages}</p>
            </div>
            <label className="search-box">
              <span>⌕</span>
              <input
                aria-label="Cari di halaman ini"
                placeholder="Cari di halaman ini"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>

          {loading ? (
            <div className="empty-state">Memuat koleksi buku…</div>
          ) : loadError ? (
            <div className="empty-state" role="alert">Koleksi belum dapat dimuat. Coba muat ulang halaman.</div>
          ) : (
            <>
              <BookList buku={filteredBuku} onEdit={handleEdit} onDelete={handleDelete} />
              <nav className="pagination" aria-label="Navigasi halaman buku">
                <button
                  className="small-button"
                  disabled={!pagination.previous || loading}
                  onClick={() => setPage((currentPage) => currentPage - 1)}
                >
                  ← Sebelumnya
                </button>
                <span>Halaman {page} / {totalPages}</span>
                <button
                  className="small-button"
                  disabled={!pagination.next || loading}
                  onClick={() => setPage((currentPage) => currentPage + 1)}
                >
                  Berikutnya →
                </button>
              </nav>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default Books;

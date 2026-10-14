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
  const [searchTerm, setSearchTerm] = useState("");
  const [writerInput, setWriterInput] = useState("");
  const [writerFilter, setWriterFilter] = useState("");
  const [issuedDateInput, setIssuedDateInput] = useState("");
  const [issuedDateFilter, setIssuedDateFilter] = useState("");

  const loadBooks = useCallback(async (pageNumber, signal) => {
    setLoading(true);
    setLoadError(false);

    try {
      const params = { page: pageNumber };
      if (searchTerm) params.search = searchTerm;
      if (writerFilter) params.writer = writerFilter;
      if (issuedDateFilter) params.issued_date = issuedDateFilter;

      const response = await api.get("/api/buku/", {
        params,
        signal,
      });
      setBuku(response.data.results);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch (error) {
      if (error.code !== "ERR_CANCELED") setLoadError(true);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [issuedDateFilter, searchTerm, writerFilter]);

  useEffect(() => {
    const controller = new AbortController();
    loadBooks(page, controller.signal);
    return () => controller.abort();
  }, [loadBooks, page]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearchTerm(query.trim());
      setWriterFilter(writerInput.trim());
      setIssuedDateFilter(issuedDateInput);
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [issuedDateInput, query, writerInput]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId !== null) {
      await api.patch(`/api/buku/${editId}/`, form);
      await loadBooks(page);
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
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus buku ini?");
    if (!confirmDelete) return;

    await api.delete(`/api/buku/${id}/`);
    if (page > 1 && buku.length === 1) {
      setPage((currentPage) => currentPage - 1);
    } else {
      await loadBooks(page);
    }
  };

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
              <p>{pagination.count} buku ditemukan · Halaman {page} dari {totalPages}</p>
            </div>
            <label className="search-box">
              <span>⌕</span>
              <input
                aria-label="Cari judul atau penulis"
                placeholder="Cari judul atau penulis"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>

          <div className="filter-toolbar" aria-label="Filter koleksi buku">
            <label className="filter-field">
              <span>Penulis</span>
              <input
                type="text"
                aria-label="Filter berdasarkan penulis"
                placeholder="Nama penulis"
                value={writerInput}
                onChange={(event) => setWriterInput(event.target.value)}
              />
            </label>
            <label className="filter-field">
              <span>Tanggal terbit</span>
              <input
                type="date"
                aria-label="Filter berdasarkan tanggal terbit"
                value={issuedDateInput}
                onChange={(event) => setIssuedDateInput(event.target.value)}
              />
            </label>
            <button
              className="small-button clear-filters"
              type="button"
              onClick={() => {
                setQuery("");
                setWriterInput("");
                setIssuedDateInput("");
              }}
            >
              Hapus filter
            </button>
          </div>

          {loading ? (
            <div className="empty-state">Memuat koleksi buku…</div>
          ) : loadError ? (
            <div className="empty-state" role="alert">Koleksi belum dapat dimuat. Coba muat ulang halaman.</div>
          ) : (
            <>
              <BookList buku={buku} onEdit={handleEdit} onDelete={handleDelete} />
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

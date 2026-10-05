function BookForm({
  form,
  editId,
  onChange,
  onSubmit,
}) {
  return (
    <form className="panel" onSubmit={onSubmit}>
      <h2>{editId ? "Perbarui detail" : "Tambah buku"}</h2>
      <div className="field"><label htmlFor="book-title">Judul buku</label><input
        id="book-title"
        type="text"
        placeholder="Masukkan judul buku"
        required
        value={form.title}
        onChange={(e) => onChange({ ...form, title: e.target.value })}
      /></div>
      <div className="field"><label htmlFor="book-writer">Nama penulis</label><input
        id="book-writer"
        type="text"
        placeholder="Masukkan nama penulis"
        required
        value={form.writer}
        onChange={(e) => onChange({ ...form, writer: e.target.value })}
      /></div>
      <div className="field"><label htmlFor="book-date">Tanggal terbit</label><input
        id="book-date"
        type="date"
        required
        value={form.issued_date}
        onChange={(e) => onChange({ ...form, issued_date: e.target.value })}
      /></div>

      <button className="button" type="submit">
        {editId ? "Simpan Perubahan" : "Tambah Buku"}
      </button>
    </form>
  );
}

export default BookForm;

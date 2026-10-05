import BookItem from "./BookItem";

function BookList({ buku, onEdit, onDelete }) {
  return (
    <div className="book-list">
      {buku.length === 0 && <div className="empty-state">Belum ada buku yang cocok. Coba pencarian lain atau tambahkan buku baru.</div>}
      {buku.map((item) => (
        <BookItem
          key={item.id}
          buku={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default BookList;

import { Link } from "react-router-dom";

function BookItem({ buku, onEdit, onDelete }) {
  return (
    <article className="book-card">
      <div className="book-card-main"><h3>
        <Link to={`/books/${buku.id}`}>
          {buku.title}
        </Link>
      </h3>

      <p>Penulis · {buku.writer}</p>
      <p>Tanggal terbit · {buku.issued_date}</p></div>

      <div className="book-actions"><button className="small-button" onClick={() => onEdit(buku)}>
        Edit
      </button>
      <button className="small-button danger" onClick={() => onDelete(buku.id)}>
        Delete
      </button></div>
    </article>
  );
}

export default BookItem;

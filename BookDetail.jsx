import { ArrowUpRight, Plus } from "lucide-react";

export default function BookDetail({ book, onAdd, onClose }) {
  if (!book) return null;
  return (
    <aside className="book-detail" key={book.id}>
      <button className="detail-close" onClick={onClose} aria-label="Close book details">×</button>
      <span className="detail-kicker">{book.label}</span>
      <p className="detail-category">{book.genre}</p>
      <h3>{book.title}</h3>
      <p className="detail-author">By {book.author}</p>
      <p className="detail-synopsis">{book.synopsis}</p>
      <div className="detail-bottom">
        <div><small>PRICE</small><strong>₹{book.price.toLocaleString("en-IN")}</strong></div>
        <button className="add-button" onClick={() => onAdd(book)}><Plus size={15} /> Add to bag</button>
      </div>
      <span className="detail-index">SHREE / 0{["quiet-worlds","form-and-feeling","the-last-orbit","thinking-in-stillness","paper-gardens"].indexOf(book.id)+1}</span>
    </aside>
  );
}
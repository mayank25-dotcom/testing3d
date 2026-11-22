import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

export default function BagDrawer({ open, items, onClose, onChangeQty, onRemove, onCheckout }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return (
    <>
      <div className={`drawer-scrim ${open ? "visible" : ""}`} onClick={onClose} />
      <aside className={`bag-drawer ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="drawer-head">
          <div><span className="eyebrow">YOUR SELECTION</span><h2>Your bag <sup>{items.reduce((n, i) => n + i.qty, 0)}</sup></h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Close bag"><X size={19}/></button>
        </div>
        {items.length === 0 ? (
          <div className="empty-bag"><ShoppingBag size={30}/><h3>A little room for a good story.</h3><p>Your bag is waiting for its first book.</p><button onClick={onClose}>Continue exploring <span>↗</span></button></div>
        ) : (
          <>
            <div className="bag-items">
              {items.map(item => (
                <article className="bag-item" key={item.id}>
                  <div className="bag-cover" style={{background:`linear-gradient(145deg, ${item.color}, ${item.spine})`}}><span>{item.title}</span><small>SHREE</small></div>
                  <div className="bag-meta"><small>{item.genre}</small><h3>{item.title}</h3><p>₹{item.price.toLocaleString("en-IN")}</p><div className="qty-control"><button onClick={() => onChangeQty(item.id, -1)} aria-label="Decrease quantity"><Minus size={12}/></button><span>{item.qty}</span><button onClick={() => onChangeQty(item.id, 1)} aria-label="Increase quantity"><Plus size={12}/></button><button className="remove" onClick={() => onRemove(item.id)} aria-label="Remove item"><Trash2 size={13}/></button></div></div>
                </article>
              ))}
            </div>
            <div className="drawer-summary"><div><span>Subtotal</span><b>₹{subtotal.toLocaleString("en-IN")}</b></div><small>Shipping and taxes calculated at checkout.</small><button className="checkout-button" onClick={onCheckout}>Continue to checkout <span>↗</span></button><p>Thoughtful books, delivered with care.</p></div>
          </>
        )}
      </aside>
    </>
  );
}
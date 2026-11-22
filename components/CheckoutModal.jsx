import { Check, X } from "lucide-react";

export default function CheckoutModal({ open, items, onClose }) {
  if (!open) return null;
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
        <button className="modal-close" onClick={onClose} aria-label="Close checkout"><X size={18}/></button>
        <div className="modal-check"><Check size={22}/></div>
        <span className="eyebrow">CHECKOUT PREVIEW</span>
        <h2 id="checkout-title">A good choice<br/><em>starts here.</em></h2>
        <p>This is a front-end checkout preview. Connect your preferred payment and order API to accept live orders.</p>
        <div className="checkout-lines">{items.map(item => <div key={item.id}><span>{item.title} × {item.qty}</span><b>₹{(item.price * item.qty).toLocaleString("en-IN")}</b></div>)}</div>
        <div className="checkout-total"><span>Order subtotal</span><b>₹{total.toLocaleString("en-IN")}</b></div>
        <button className="checkout-button" onClick={onClose}>Back to the bookstore <span>↗</span></button>
      </section>
    </div>
  );
}

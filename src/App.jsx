import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Menu, ShoppingBag, X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BookWorld from "./components/BookWorld";
import BookDetail from "./components/BookDetail";
import BagDrawer from "./components/BagDrawer";
import CheckoutModal from "./components/CheckoutModal";
import { books, collections } from "./data/books";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  { id: "opening", label: "Opening" },
  { id: "showcase", label: "The edit" },
  { id: "collections", label: "Collections" },
  { id: "closing", label: "Our world" }
];

export default function App() {
  const progress = useRef(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selected, setSelected] = useState(null);
  const [bagOpen, setBagOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [bag, setBag] = useState([]);
  const [activeSection, setActiveSection] = useState("opening");
  const [menuOpen, setMenuOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? window.scrollY / max : 0;
      setScrollProgress(value);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();

    const triggers = [
      { id: "opening", start: "top top", end: "bottom top", value: 0.12 },
      { id: "showcase", start: "top 70%", end: "bottom 40%", value: 0.5 },
      { id: "collections", start: "top 70%", end: "bottom 40%", value: 0.84 },
      { id: "closing", start: "top 70%", end: "bottom top", value: 1 }
    ];

    const ctx = gsap.context(() => {
      triggers.forEach((item) => {
        ScrollTrigger.create({
          trigger: `#${item.id}`,
          start: item.start,
          end: item.end,
          onEnter: () => setActiveSection(item.id),
          onEnterBack: () => setActiveSection(item.id)
        });
      });

      ScrollTrigger.create({
        trigger: "#scroll-track",
        start: "top top",
        end: "bottom bottom",
        scrub: reducedMotion ? false : 1.4,
        onUpdate: self => {
          const p = self.progress;
          progress.current = p;
        }
      });

      if (!reducedMotion) {
        gsap.utils.toArray(".reveal").forEach((el) => {
          gsap.fromTo(el, { y: 32, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.9, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true }
          });
        });
      }
    });
    return () => {
      window.removeEventListener("scroll", update);
      ctx.revert();
    };
  }, [reducedMotion]);

  const addToBag = useCallback((book) => {
    setBag(current => {
      const found = current.find(item => item.id === book.id);
      if (found) return current.map(item => item.id === book.id ? { ...item, qty: item.qty + 1 } : item);
      return [...current, { ...book, qty: 1 }];
    });
    setBagOpen(true);
  }, []);

  const changeQty = (id, amount) => setBag(current => current
    .map(item => item.id === id ? { ...item, qty: item.qty + amount } : item)
    .filter(item => item.qty > 0));
  const removeItem = id => setBag(current => current.filter(item => item.id !== id));
  const jumpTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    setMenuOpen(false);
  };
  const totalQty = bag.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="app-shell">
      <div className="reading-progress"><span style={{ transform: `scaleX(${scrollProgress})` }} /></div>
      <header className="site-header">
        <a className="brand" href="#opening" onClick={e => {e.preventDefault(); jumpTo("opening");}}>
          <span className="brand-mark">S<sup>✳</sup></span><span><b>SHREE</b><small>THE ART OF READING</small></span>
        </a>
        <nav className="desktop-nav">
          {sections.map(s => <button key={s.id} className={activeSection === s.id ? "active" : ""} onClick={() => jumpTo(s.id)}>{s.label}</button>)}
        </nav>
        <div className="header-actions">
          <button className="bag-trigger" onClick={() => setBagOpen(true)}><ShoppingBag size={16}/><span>Bag</span><i>{totalQty}</i></button>
          <button className="mobile-menu" onClick={() => setMenuOpen(v => !v)} aria-label="Open navigation">{menuOpen ? <X/> : <Menu/>}</button>
        </div>
        {menuOpen && <div className="mobile-nav">{sections.map(s => <button key={s.id} onClick={() => jumpTo(s.id)}>{s.label}<ArrowUpRight size={14}/></button>)}</div>}
      </header>

      <div className="scroll-pills">
        {sections.map((s, i) => <button key={s.id} className={activeSection === s.id ? "selected" : ""} onClick={() => jumpTo(s.id)}><span>{String(i+1).padStart(2,"0")}</span>{s.label}</button>)}
      </div>

      <div className="world-wrap">
        <BookWorld progress={progress} selected={selected} onSelect={setSelected} reducedMotion={reducedMotion}/>
        <div className="world-vignette"/>
      </div>

      <main id="scroll-track">
        <section className="chapter hero-chapter" id="opening">
          <div className="hero-copy reveal">
            <div className="eyebrow"><span className="eyebrow-line"/> AN INDEPENDENT BOOKSELLER <span className="eyebrow-year">EST. 2020</span></div>
            <h1>Stories shape<br/>the <em>way we see.</em></h1>
            <p>A considered collection for curious minds. Find your next favourite, discover a new perspective, and make room for a little wonder.</p>
            <button className="dark-cta" onClick={() => jumpTo("showcase")}>Explore the edit <ArrowUpRight size={15}/></button>
            <div className="hero-foot"><span className="foot-rule"/><span>SCROLL TO BEGIN</span><ArrowDown size={13}/></div>
          </div>
          <div className="hero-side-note"><span>01 / 04</span><i/>A BOOK IS A DOORWAY</div>
          <div className="hero-caption">THE SHREE BOOKSHOP <span>✳</span> INDIA</div>
        </section>

        <section className="chapter showcase-chapter" id="showcase">
          <div className="chapter-heading reveal">
            <div className="eyebrow">01 — THE FEATURED EDIT</div>
            <h2>Some stories<br/>stay <em>with you.</em></h2>
            <p>Five books. Five different worlds. Select a cover in the 3D space to bring its story into focus.</p>
          </div>
          <div className="showcase-hint"><span className="hint-dot"/> SELECT A BOOK TO INSPECT</div>
          <div className="showcase-bottom"><span>THE SHREE SELECTION</span><span>MOVE YOUR POINTER TO EXPLORE ↗</span></div>
        </section>

        <section className="chapter collections-chapter" id="collections">
          <div className="chapter-heading reveal">
            <div className="eyebrow">02 — FIND YOUR WORLD</div>
            <h2>Follow your<br/><em>curiosity.</em></h2>
            <p>Move through the shelves by mood, subject, and the questions you can't stop asking.</p>
          </div>
          <div className="collection-list">
            {collections.map((collection, i) => {
              const book = books.find(b => b.id === collection.bookId);
              return <button className={`collection-row reveal ${selected?.id === book.id ? "is-active" : ""}`} key={collection.name} onClick={() => setSelected(book)}>
                <span className="collection-num">0{i+1}</span><span className="collection-title">{collection.name}</span><span className="collection-kicker">{collection.kicker}</span><span className="collection-count">{collection.count}</span><ArrowUpRight size={18}/>
              </button>;
            })}
          </div>
          <div className="collection-foot">A SMALL, THOUGHTFUL LIBRARY — ALWAYS GROWING.</div>
        </section>

        <section className="chapter closing-chapter" id="closing">
          <div className="closing-content reveal">
            <div className="eyebrow"><span className="eyebrow-line"/> THE SHREE BOOKSHOP</div>
            <h2>Make space<br/>for <em>new worlds.</em></h2>
            <p>Good books don't just fill a shelf. They change what you notice.</p>
            <button className="dark-cta" onClick={() => setBagOpen(true)}>Visit your bag <ShoppingBag size={15}/></button>
          </div>
          <div className="closing-footer"><span>SHREE — THE ART OF READING</span><span>© 2026 SHREE EDUCATION & PUBLICATION</span><a href="https://bookprinters.in" target="_blank" rel="noreferrer">BOOKPRINTERS.IN ↗</a></div>
        </section>
      </main>

      <BookDetail book={selected} onAdd={addToBag} onClose={() => setSelected(null)}/>
      <BagDrawer open={bagOpen} items={bag} onClose={() => setBagOpen(false)} onChangeQty={changeQty} onRemove={removeItem} onCheckout={() => {setBagOpen(false);setCheckoutOpen(true);}}/>
      <CheckoutModal open={checkoutOpen} items={bag} onClose={() => setCheckoutOpen(false)}/>
      <div className="bottom-hint">SCROLL TO EXPLORE <span>↓</span></div>
    </div>
  );
}
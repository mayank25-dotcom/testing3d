# SHREE — Immersive 3D Bookshop

A React + Three.js bookstore experience with a scroll-driven 3D book world, editorial chapters, interactive book inspection, bag drawer and checkout preview.

## Stack
- React 18 + Vite
- Tailwind CSS
- Three.js with `@react-three/fiber` and `@react-three/drei`
- GSAP + ScrollTrigger
- Lucide icons

## Run locally
```bash
npm install
npm run dev
```

Create a production build:
```bash
npm run build
npm run preview
```

## Experience
- Fixed 3D Canvas with five procedural, canvas-textured book covers.
- ScrollTrigger updates a smoothed 3D choreography progress value. Books assemble, glide into a floating arc, and transition into a collection formation.
- Hover/click books to select them; the selected book moves forward and the editorial detail card appears.
- Category rows select curated books.
- Bag drawer supports quantity changes, removal, subtotal and checkout preview.
- Responsive navigation, scroll progress, section jump pills, reduced-motion handling and DPR clamping.

## Important integration notes
- Product names, authors, synopsis, categories and INR prices are demo content in `src/data/books.js`. Replace them with Shree's actual catalogue before launch.
- All book artwork is generated procedurally at runtime; no remote cover images are required.
- The checkout is intentionally a UI preview only. It does not collect personal/payment details or place real orders. Connect it to your PHP/MySQL backend and Razorpay or another approved payment provider for live commerce.
- This is a standalone React/Vite project, not a drop-in replacement for an existing PHP website. Deploy the built `dist/` output to a suitable static host or configure your server to serve the React build. If integrating with the existing PHP store, keep API, authentication and payment handling on the server.
- The 3D scene uses low-complexity rounded box meshes and a clamped device pixel ratio. For very low-end devices, the reduced-motion preference disables continuous book float motion.

## Suggested production next steps
1. Replace demo catalogue with the real book inventory and product images/content.
2. Add backend endpoints for cart persistence, stock, customer orders and checkout.
3. Integrate the chosen payment gateway only on the server side; never expose secret keys in frontend code.
4. Test on target mobile devices and tune lighting/performance.

// src/App.jsx
import { Routes, Route, Link } from 'react-router-dom'   // ✅ include Link
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import Contact from './pages/Contact.jsx'

export default function App() {
  return (
    <div className="container-fluid px-0">
      {/* Simple navigation menu */}
      <nav style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>          {/* ✅ points to existing page */}
        <Link to="/contact">Contact</Link>
      </nav>

      {/* This decides which page shows */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />        {/* ✅ use Shop here */}
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </div>
  )
}
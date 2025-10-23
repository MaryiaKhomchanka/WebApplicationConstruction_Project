
import { Routes, Route, Link } from 'react-router-dom'   
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import Contact from './pages/Contact.jsx'

export default function App() {
  return (
    <div className="container-fluid px-0">
   

      <nav className= "d-flex justify-content-center justify-content-lg-between aligh-items-center align-items-md-stretch gap-2 gap-md-4 gap-xl-5 p-3">
        <Link to="/" className = 'btn btn-primary btn-lg'>Home</Link>
        <Link to="/shop" className = 'btn btn-primary btn-lg'>Shop</Link>         
        <Link to="/contact" className = 'btn btn-primary btn-lg'>Contact</Link>
      </nav>

    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />        
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </div>
  )
}
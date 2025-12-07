
import { Routes, Route, Link } from 'react-router-dom'   
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import Contact from './pages/Contact.jsx'
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';



export default function App() {
  const isLoggedIn = !!localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/';
  };
  return (
    <div className="container-fluid px-0">
   
      
      <nav className= "navbar navbar-expand-md navbar-light bg-light px-3">

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

  
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className = "d-flex flex-column flex-md-row align-items-center gap-3 mt-3 mt-md-0 me-md-auto">
            <Link to = "/" className = "btn btn-primary btn-lg">Home</Link>
            <Link to = "/shop" className = "btn btn-primary btn-lg">Shop</Link>
            <Link to = "/contact" className = "btn btn-primary btn-lg">Contact</Link>
          </div>


          <div className = "d-flex justify-content-md-end justify-content-center mt-3 mt-md-0">
            {isLoggedIn ?(
              <Link className = "btn btn-primary btn-lg" to = "/profile">
                My Profile
              </Link>
            ) : (
              <Link className = "btn btn-primary btn-lg" to = "/login">
                Login
              </Link>
            )}
          </div>

        </div>
      </nav>
        
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />        
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </div>
  )
}
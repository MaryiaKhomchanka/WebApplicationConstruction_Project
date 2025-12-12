import {Routes, Route, Link} from 'react-router-dom'; //Client-side routing, like page changes without reloading  
import {useState, useEffect} from 'react'; //Used for states (like logging in) and side effects (like fetching data)
import Home from './pages/Home.jsx';
import Contact from './pages/Contact.jsx'
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';



export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token')); //State to track if the user is logged in


  const [isStreamOnline, setIsStreamOnline] = useState(null); //null = checking the stream's state, true = online, false = offline
  const [streamTitle, setStreamTitle] = useState(''); //Title of the current stream

   useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/twitch/status'); //Calling the backend API
        const data = await res.json(); //Converting the response to JSON

        if (!res.ok) throw new Error(data.error || 'Failed to load Twitch status'); 

        setIsStreamOnline(data.online); //Setting the stream status  
        setStreamTitle(data.streamTitle || ''); //Setting the stream title
      } catch (error) { 
        console.error(error); 
        setIsStreamOnline(false); //Setting the stream status to offline in case of an error
      }
    };

    fetchStatus(); //Getting initial stream status
    const interval = setInterval(fetchStatus, 60000); //Updating the stream status every 60 seconds
    return () => clearInterval(interval); //When the App component is removed, the interval is cleared
  }, []);

  useEffect(() => {
    const update = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    }; //Function to update the login state
  
    window.addEventListener("storage", update); //Making sure the state updates across tabs
    window.addEventListener("loginChange", update); //Used to update the login/profile button without page reload
  
    return () => {
      window.removeEventListener("storage", update); //Stopping the event on component unmount
      window.removeEventListener("loginChange", update); 
    };
  }, []);


  return (
    <div className="container-fluid px-0">
   
      
      <nav className= "navbar navbar-expand-md px-3">

        {/*Mobile navbar button*/}
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

        {/*Elements inside the collapsible navbar*/}
        <div className="collapse navbar-collapse" id="navbarNav">


          <div className = "d-flex flex-column flex-md-row align-items-center gap-3 mt-3 mt-md-0 me-md-auto">
            <Link to = "/" className = "btn btn-primary btn-lg NavButton">Home</Link>
            <Link to = "/contact" className = "btn btn-primary btn-lg NavButton">Contact</Link>
          </div>



          <div className = "d-none d-md-block mx-3">
            {isStreamOnline === null && <span className = "TwitchStatus"> Checking...</span>}

            {isStreamOnline === true && (
              <span className = "TwitchStatus TwitchOnline">
                Online {streamTitle && `– ${streamTitle}`}
              </span>
            )}

            {isStreamOnline === false && (
              <span className = "TwitchStatus TwitchOffline"> Offline</span>
            )}
          </div>

          {/*Changing the button based on the login state*/}
          <div className = "d-flex justify-content-md-end justify-content-center mt-3 mt-md-0">
            {isLoggedIn ?(
              <Link className = "btn btn-primary btn-lg NavButton" to = "/profile">
                My Profile
              </Link>
            ) : (
              <Link className = "btn btn-primary btn-lg NavButton" to = "/login">
                Login
              </Link>
            )}
          </div>

        </div>
      </nav>
        
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </div>
  )
}
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// import './index.css'

import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

//Importing Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'

//Importing styles.css
import './styles/styles.css'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

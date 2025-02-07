import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "bootstrap-icons/font/bootstrap-icons.css";
import './assets/all.scss'
// import App from './AppW2.jsx'
// import App from './AppW3.jsx'
import App from './AppW5'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <App />
  // </StrictMode>,
)

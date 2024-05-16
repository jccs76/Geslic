import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App';
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import 'primeicons/primeicons.css';
import './index.css'
import { PrimeReactProvider } from 'primereact/api';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode> 
     <PrimeReactProvider>
      <BrowserRouter>
        <App>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route/>
        </Routes>
        </App>
      </BrowserRouter>        
    </PrimeReactProvider>   
  </React.StrictMode>,
)

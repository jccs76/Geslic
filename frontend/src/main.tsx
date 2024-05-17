import React from 'react'
import ReactDOM from 'react-dom/client'
import { PrimeReactProvider } from 'primereact/api';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import 'primeicons/primeicons.css';


import App from './App';
import Home  from './pages/Home';
import Customers from './pages/Customers';
import Products from './pages/Customers';
import Licenses from './pages/Licenses';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode> 
     <PrimeReactProvider>
      <BrowserRouter>
        <App>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/licenses" element={<Licenses />} />
        </Routes>        
        </App>
      </BrowserRouter>        
    </PrimeReactProvider>   
  </React.StrictMode>,
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import { PrimeReactProvider } from 'primereact/api';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import 'primeicons/primeicons.css';

import App from './App';
import Home  from './pages/home/Home.tsx';
import Customers from './pages/customers/Customers.tsx';
import Products from './pages/products/Products.tsx';
import Licenses from './pages/licenses/Licenses.tsx';
import Customer from './pages/customer/Customer.tsx';
import Product from './pages/product/Product.tsx';
import License from './pages/license/License.tsx';
import Supports from './pages/supports/Supports.tsx';
import CustomerLicenses from './pages/customerLicenses/CustomerLicenses.tsx';
import Support from './pages/support/Support.tsx';



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode> 
     <PrimeReactProvider>
      <BrowserRouter>
        <App>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customer/" element={<Customer />} />
            <Route path="/customer/:id" element={<Customer />} />
            <Route path="/customer/:id/licenses" element={<CustomerLicenses/>} />
            <Route path="/products" element={<Products />} />
            <Route path="/product" element={<Product />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/licenses" element={<Licenses />} />
            <Route path="/license" element={<License />} />
            <Route path="/license/:id" element={<License />} />
            <Route path="/supports" element={<Supports />} />
            <Route path="/support/:id/renew" element={<Support />} />
        </Routes>        
        </App>
      </BrowserRouter>        
    </PrimeReactProvider>   
  </React.StrictMode>,
)

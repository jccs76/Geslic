import { Route, Routes } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import Dashboard  from '../pages/home/Dashboard.tsx';
import Customers from '../pages/customers/Customers.tsx';
import Products from '../pages/products/Products.tsx';
import Licenses from '../pages/licenses/Licenses.tsx';
import Customer from '../pages/customers/Customer.tsx';
import Product from '../pages/products/Product.tsx';
import License from '../pages/licenses/License.tsx';
import Supports from '../pages/supports/Supports.tsx';
import CustomerLicenses from '../pages/customers/CustomerLicenses.tsx';
import Support from '../pages//supports/Support.tsx';
import ProtectedRoute from "./ProtectedRoute.tsx";


const AppRoutes = () => {

  return (
    <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>        
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:id" element={<Customers />} />            
            <Route path="/customer/" element={<Customer />} />            
            <Route path="/customer/:id" element={<Customer />} />
            <Route path="/customer/:id/licenses" element={<CustomerLicenses/>} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<Products />} />
            <Route path="/product" element={<Product />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/licenses" element={<Licenses />} />
            <Route path="/licenses/:id" element={<Licenses />} />
            <Route path="/license" element={<License />} />            
            <Route path="/license/:id" element={<License />} />
            <Route path="/license/:id/support" element={<Supports/>} />
            <Route path="/supports" element={<Supports />} />
            <Route path="/support/:id" element={<Support />} />
            <Route path="*" element={<Dashboard />} />
        </Route>
    </Routes>        
  );  
}

export default AppRoutes

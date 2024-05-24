import ReactDOM from 'react-dom/client'
import { PrimeReactProvider } from 'primereact/api';
import { BrowserRouter, } from 'react-router-dom';

import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import 'primeicons/primeicons.css';

import App from './App';
import AppRoutes from './routes/AppRoutes.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode> 
     <PrimeReactProvider>
      <BrowserRouter>
        <App>
          <AppRoutes/>
        </App>
      </BrowserRouter>        
    </PrimeReactProvider>   
  // </React.StrictMode>
)

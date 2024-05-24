import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import './styles/layout/layout.scss';
import './styles/app/app.scss';

import localeEs from "primelocale/es.json";
import { addLocale, locale } from 'primereact/api';

import { LayoutProvider } from "./layout/context/layoutcontext";
import { AuthProvider } from './context/AuthContext';

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function App({ children }: RootLayoutProps) {
  addLocale('es-ES', localeEs.es);
  locale("es-ES");
  
  
  return (
    <AuthProvider>
      <LayoutProvider>{children}</LayoutProvider>
    </AuthProvider>
  );
}

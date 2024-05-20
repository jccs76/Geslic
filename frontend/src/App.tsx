import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import './styles/layout/layout.scss';
import './styles/app/app.scss';

import localeEs from "primelocale/es.json";
import { addLocale, locale } from 'primereact/api';

import { LayoutProvider } from "./layout/context/layoutcontext";



interface RootLayoutProps {
    children: React.ReactNode;
}

export default function App({ children }: RootLayoutProps) {
  addLocale('es', localeEs.es);
  locale("es");
  
  return (
    <LayoutProvider>{children}</LayoutProvider>
  );
}

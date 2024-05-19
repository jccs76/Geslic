import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import "./styles/layout/layout.scss";
import './styles/badges.scss';

import { LayoutProvider } from "./layout/context/layoutcontext";
import { addLocale, locale } from 'primereact/api';


interface RootLayoutProps {
    children: React.ReactNode;
}

export default function App({ children }: RootLayoutProps) {
  addLocale('es', {
    firstDayOfWeek: 1,
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    today: 'Hoy',
    clear: 'Limpiar',
    accept: 'Sí',
    reject: 'No'
});    
  locale('es');  
  
  return (
    <LayoutProvider>{children}</LayoutProvider>
  );
}

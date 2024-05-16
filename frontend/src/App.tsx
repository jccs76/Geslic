import "primereact/resources/primereact.css";
import "./styles/layout/layout.scss";
import { LayoutProvider } from "./layout/context/layoutcontext";


interface RootLayoutProps {
    children: React.ReactNode;
}

export default function App({ children }: RootLayoutProps) {
  return (
    <LayoutProvider>{children}</LayoutProvider>
  );
}

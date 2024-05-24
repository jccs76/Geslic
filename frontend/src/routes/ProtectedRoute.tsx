import { Outlet, useNavigate } from "react-router-dom";
import Layout from "../layout/layout";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";


const ProtectedRoute = () => {
    const {isAuthenticated} = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
      if (!isAuthenticated) {      
        navigate("/login");
      }  
  },[])    
    
    return (
        <Layout><Outlet/></Layout>
    );
  };

  export default ProtectedRoute;
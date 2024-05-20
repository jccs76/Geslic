import Layout from "../../layout/layout";
import { CustomerService } from "../../services/CustomerService";
import { App } from "@/types";
import {  useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";


const Customer = () => {

    let emptyCustomer: App.CustomerType = {
        id: '',
        name: ''
    };
    
    const navigate = useNavigate();

    const {id} = useParams();    
    
    const [customer, setCustomer] = useState<App.CustomerType>(emptyCustomer);    

    useEffect(() => {        
        {id && (
            CustomerService.getCustomer(id).then((data) => setCustomer(data as any))
        )};    
    }, []);


    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {        
        e.preventDefault();

        const name = e.target.name;
        const val = (e.target && e.target.value) || '';
        let _customer = { ...customer };
        _customer[`${name}`] = val;

        setCustomer(_customer);
    };

    const handleSave = () => {
      
    }

    const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (id){
            CustomerService.updateCustomer(id, customer).then((data) => setCustomer(data as any))
            
        } else {
            CustomerService.createCustomer(customer).then((data) => setCustomer(data as any))
        }
        navigate(-1);
    }

  return (
    <Layout>
    <div className="grid">
            <div className="col-12">
                <h5>{id ? 'Editar' : 'Nuevo'} Cliente</h5>
                <div className="card p-fluid">
                    <form onSubmit={handleSubmit}>                                  
                    <div className="field grid">
                        <label htmlFor="name" className="">Name</label>
                        <InputText id="customer.name" name="name"  value={customer.name} autoFocus type="text" onChange={onInputChange} />
                    </div>
                    <div className="col-2 col-offset-5">
                        <Button type="submit" icon="pi pi-save" label="Guardar" severity="info" onClick={handleSave} />                    
                    </div>
                    </form>
                </div>
            </div>        
    </div>
    </Layout>
  )
}

export default Customer;
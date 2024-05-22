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
            <div className="flex justify-content-start align-items-baseline">
                <Button className="mr-2"  icon="pi pi-chevron-left" rounded text onClick={() => navigate('/customers')} />                    
                <h5>{id ? 'Editar' : 'Nuevo'} Cliente</h5>
            </div>
                <div className="card p-fluid">
                    <form onSubmit={handleSubmit}>                                  
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="name" className="">Nombre</label>                        
                            <InputText id="name" name="name"  value={customer.name} autoFocus type="text" onChange={onInputChange} />
                        </div>
                        <div className="field col-12">                    
                            <label htmlFor="address" className="">Dirección</label>
                            <InputText id="address" name="address"  value={customer.address} type="text" onChange={onInputChange} />
                        </div>
                        <div className="field col-12 md:col-2">                    
                            <label htmlFor="zipCode" className="">Código Postal</label>                    
                            <InputText id="zipCode" name="zipCode"  value={customer.zipCode} type="text" onChange={onInputChange} />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="state" className="">Provincia</label>
                            <InputText id="state" name="state"  value={customer.state} type="text" onChange={onInputChange} />
                        </div>
                        <div className="field col-12 md:col-7">
                        <label htmlFor="city" className="">Localidad</label>
                            <InputText id="city" name="city"  value={customer.city} type="text" onChange={onInputChange} />                    
                        </div>
                        <div className="field col-12 md:col-2 lg:col-2 xl:col-2">    
                            <label htmlFor="phoneNumber" className="">Teléfono</label>
                            <InputText id="phoneNumber" name="phoneNumber"  value={customer.phoneNumber} type="text" onChange={onInputChange} />
                        </div>
                        <div className="field col-12 md:col-5">    
                            <label htmlFor="email" className="">E-mail</label>
                            <InputText id="email" name="email"  value={customer.email} type="text" onChange={onInputChange} />
                        </div>
                        <div className="col-2 col-offset-5 mt-5">
                            <Button type="submit" icon="pi pi-save" label="Guardar" severity="info" />                    
                        </div>
                    </div>
                    </form>
                </div>
            </div>        
    </div>
    </Layout>
  )
}

export default Customer;
import { CustomerService } from "../../services/CustomerService";
import { App } from "@/types";
import {  useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputMask } from "primereact/inputmask";
import { Controller, useForm } from 'react-hook-form';
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";

const Customer = () => {

    const defaultValues: App.CustomerType = {        
        name: '',
        address: '',
        zipCode: '',
        state: '',
        city: '',
        phoneNumber: '',
        email: ''
    };
    
    const toast = useRef<Toast>(null);

    const navigate = useNavigate();

    const {id} = useParams();    
        
    const { control, formState: { errors }, handleSubmit, reset} = useForm<App.CustomerType>({ defaultValues });

    useEffect(() => {        
        {id && (
            CustomerService.getCustomer(id).then((data) => reset(data))
        )};    
    }, []);

    const getFormErrorMessage = (name : string) => {
        return errors[name] && <small className="p-error">{errors[name]?.message}</small>
    };

    const onSubmit = (data : App.CustomerType) => {
        console.log(data);
        if (id){
            CustomerService.updateCustomer(id, data)
                            .then((res) => {
                                if (!res?.ok) {
                                    if (res?.status == 409){
                                        toast.current?.show({
                                            severity: 'error',
                                            summary: 'Ya existe',
                                            detail: 'Un cliente con este nombre ya existe',
                                            life: 3000
                                        });
                                    }        
                                }else {                
                                    navigate(-1)
                                };

                            })
            
        } else {
            CustomerService.createCustomer(data)
                            .then((res) => {
                                if (!res?.ok) {
                                    if (res?.status == 409){
                                        toast.current?.show({
                                            severity: 'error',
                                            summary: 'Ya existe',
                                            detail: 'Un cliente con este nombre ya existe',
                                            life: 3000
                                        });
                                    }        
                                }else {                
                                    navigate(-1)
                                };
                            })
        }
       
    }

  return (    
    <div className="grid">
        <Toast ref={toast} />
        <div className="col-12">
            <div className="flex justify-content-start align-items-baseline">
                <Button className="mr-2"  icon="pi pi-chevron-left" rounded text onClick={() => navigate('/customers')} />                    
                <h5>{id ? 'Editar' : 'Nuevo'} Cliente</h5>
            </div>
                <div className="card p-fluid">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid formgrid grid">                                       
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-6">
                                <label htmlFor="name" className="">Nombre</label> 
                                <Controller name="name" control={control} rules={{ required: 'Nombre obligatorio.'}}
                                    render={({ field, fieldState }) => (                                                       
                                    <InputText id={field.name} {... field} value={field.value} autoFocus type="text" className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                {getFormErrorMessage('name')}                                
                            </div>
                            <div className="field col-12">                    
                                <label htmlFor="address" className="">Dirección</label>
                                <Controller name="address" control={control} render={({ field }) => (
                                    <InputText id="field.name" {... field} value={field.value} type="text" />
                                )} />                                 
                            </div>
                            <div className="field col-12 md:col-2">                    
                                <label htmlFor="zipCode" className="">Código Postal</label>
                                <Controller name="zipCode" control={control} render={({ field }) => (
                                    <InputMask id="field.name" {... field} value={field.value} mask="99999" type="text"  />
                                )} />                                 
                            </div>
                            <div className="field col-12 md:col-3">
                                <label htmlFor="state" className="">Provincia</label>
                                <Controller name="state" control={control} render={({ field }) => (                                
                                    <InputText id="field.name" {... field} value={field.value} type="text"  />
                                )} />
                            </div>
                            <div className="field col-12 md:col-7">
                                <label htmlFor="city" className="">Localidad</label>
                                <Controller name="city" control={control} render={({ field }) => (                                
                                    <InputText id="field.name" {... field} value={field.value} type="text"  />                    
                                )} />
                            </div>
                            <div className="field col-12 md:col-2 lg:col-2 xl:col-2">    
                                <label htmlFor="phoneNumber" className="">Teléfono</label>
                                <Controller name="phoneNumber" control={control} render={({ field }) => (                                                                
                                <InputMask id="field.name" {... field} value={field.value} mask="999999999"  type="text"  />
                                )} />
                            </div>
                            <div className="field col-12 md:col-5">    
                                <label htmlFor="email" className="">E-mail</label>
                                <Controller name="email" control={control} rules={{pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Email inválido. Ej: usuario@email.com' }}}
                                            render={({ field, fieldState }) => ( 
                                <InputText  id={field.name} {...field} value={field.value} type="text"  className={classNames({ 'p-invalid': fieldState.invalid })} />
                            )} /> {getFormErrorMessage('email')}
                            </div>
                           
                            <div className="col-2 col-offset-5 mt-5">
                                <Button type="submit" icon="pi pi-save" label="Guardar" severity="info" />                    
                            </div>
                        </div>                        
                    </form>    
                </div>                
            </div>        
    </div>

  )
}

export default Customer;
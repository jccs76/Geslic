import { ProductService } from "../../services/ProductService";
import { App } from "@/types";
import {  useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { Controller, useForm } from 'react-hook-form';
import { classNames } from "primereact/utils";


const Product = () => {

    let defaultValues: App.ProductType= {
        id: '',
        name: '',
        description: '',
        price: 0
    };

    const toast = useRef<Toast>(null);

    const navigate = useNavigate();

    const {id} = useParams();    
    
    const { control, formState: { errors }, handleSubmit, reset} = useForm<App.ProductType>({ defaultValues });

    useEffect(() => {        
        {id && (
            ProductService.getProduct(id)
           .then((data) => {reset(data)})
        )};    
    }, []);

    const getFormErrorMessage = (name : string) => {
        return errors[name] && <small className="p-error">{errors[name]?.message}</small>
    };

    const onSubmit = (data : any) => {
        console.log(data);
        if (id){
            ProductService.updateProduct(id, data).then((res) => { 
                console.log(res);
                if (res?.status == 409){
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Ya existe',
                        detail: 'Un producto con este nombre ya existe',
                        life: 3000
                    });
                }else {                
                    navigate(-1)
                };        
            })            
        } else {
            ProductService.createProduct(data).then((res) => {
                console.log(res);
                if (!res?.ok) {
                    if (res?.status == 409){
                        toast.current?.show({
                            severity: 'error',
                            summary: 'Ya existe',
                            detail: 'Un producto con este nombre ya existe',
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
                <Button className="mr-2"  icon="pi pi-chevron-left" rounded text onClick={() => navigate('/products')} />                    
                <h5>{id ? 'Editar' : 'Nuevo'} Producto</h5>
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
                        <label htmlFor="description" className="">Descripción</label>
                        <Controller name="description" control={control} render={({ field }) => (
                            <InputText id={field.name} {... field} value={field.value} type="text"  />
                        )} />
                    </div>
                    <div className="field col-12 md:col-2">                    
                        <label htmlFor="price" className="">Precio</label> 
                        <Controller name="price" control={control} rules={{ required: 'Precio obligatorio.', min: {value : 1, message: 'Importe mayor que 0'}}} 
                                    render={({ field, fieldState }) => (                   
                            <InputNumber  id={field.name} ref={field.ref} onBlur={field.onBlur}  
                                         value={field.value} onValueChange={(e) => field.onChange(e)} mode="currency" currency="EUR" locale="es-ES" inputClassName={classNames({ 'p-invalid': fieldState.error })} />
                        )} />
                        {getFormErrorMessage('price')} 
                    </div>                                                                              
                </div>
                <div className="col-2 col-offset-5">
                    <Button type="submit" icon="pi pi-save" tooltip="Guardar" severity="info" />                    
                </div>
                </form>
            </div>
        </div>
    </div>
  )
}


export default Product;

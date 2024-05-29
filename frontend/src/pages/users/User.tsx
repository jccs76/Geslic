import { UserService } from "../../services/UserService";
import { App } from "@/types";
import {  useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { Toast } from "primereact/toast";
import { Controller, useForm } from 'react-hook-form';
import { classNames } from "primereact/utils";

const User = () => {

    let defaultValues: App.UserType= {        
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        isAdmin: false
    };

    const toast = useRef<Toast>(null);

    const navigate = useNavigate();

    const {id} = useParams();    
    
    
 
    const { control, formState: { errors }, handleSubmit, reset} = useForm<App.UserType>({ defaultValues });

    useEffect(() => {        
        {id && (
            UserService.getUser(id)
           .then((data) => {reset(data);
           })                  
            .catch( (error) => console.log(error))
        )};    
    }, []);


    const getFormErrorMessage = (name : string) => {
        return errors[name] && <small className="p-error">{errors[name]?.message}</small>
    };

    
    const onSubmit = (data : App.UserType) => {      
        if (id){
            console.log(data);
            UserService.updateUser(id, data).then((res) => {                                
                if (!res?.ok) {
                    if (res?.status == 409){
                        toast.current?.show({
                            severity: 'error',
                            summary: 'Faltan datos',
                            detail: 'El usuario debe tener un Nombre',
                            life: 3000
                        });
                    }        
                }else {                
                    navigate(-1)
                };
            })            
        } else {            
            UserService.createUser(data).then((res) => {                
                if (!res?.ok) {
                    if (res?.status == 409){
                        toast.current?.show({
                            severity: 'error',
                            summary: 'Usuario existente',
                            detail: 'Usuario con mismo email ya existe',
                            life: 3000
                        });        
                    }
                }else {                
                    navigate(-1);
                }            
            })
        }

    }


  return (
    
    <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="flex justify-content-start align-items-baseline">
                    <Button className="mr-2"  icon="pi pi-chevron-left" rounded text onClick={() => navigate('/users')} />                    
                    <h5>{id ? 'Editar' : 'Nuevo'} Usuario</h5>
                </div>
                <div className="card p-fluid">                   
                        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-6">                                
                                <label htmlFor="firstName" className="">Nombre*</label>                        
                                <Controller name="firstName" control={control} rules={{ required: 'Nombre obligatorio.'}}
                                    render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus value={field.value} type="text" className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                {getFormErrorMessage('firstName')}                                
                            </div>
                            <div className="field col-12 md:col-8">                    
                                <label htmlFor="lastName" className="">Apellidos</label>
                                <Controller name="lastName" control={control} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} value={field.value} type="text" className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />                                
                            </div>
                            <div className="field col-12 md:col-6">                    
                                <label htmlFor="email" className="">Email*</label>
                                <Controller name="email" control={control} rules={{required: 'Email obligatorio', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Email inválido. Ej: usuario@email.com' }}}
                                            render={({ field, fieldState }) => (                                
                                    <InputText id={field.name} {...field} value={field.value} disabled={!!id} type="text" className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} /> 
                                {getFormErrorMessage('email')}
                            </div>                                                          
                            <div className="field col-12 md:col-5">                    
                                <label htmlFor="password" className="">Contraseña</label>
                                {!id ?
                                    <Controller name="password" control={control} rules={{required: 'Password obligatorio' }} render={({ field, fieldState }) => (
                                        <Password id={field.name} {...field} toggleMask feedback={false} className={classNames({ 'p-invalid': fieldState.invalid })} />                                   
                                    )} /> :
                                    <Controller name="password" control={control} render={({ field, fieldState }) => (
                                        <Password id={field.name} {...field}  feedback={false} className={ classNames({ 'p-invalid': fieldState.invalid})} />
                                    // <Password inputId="user.password" name="password" toggleMask={true} feedback={false} onChange={onInputChange}  className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem" />
                                    )} /> 
                                }
                                {getFormErrorMessage('password')}
                            </div>                            
                            <div className="field col-12 flex flex-align-center">                    
                                <label htmlFor="isAdmin" className=" mr-3">Administrador</label>                    
                                <Controller name="isAdmin" control={control}  render={({ field }) => (
                                    <Checkbox id="field.name"  {...field} checked={field.value} />
                                )} />
                            </div>                                                          
                            {getFormErrorMessage('isAdmin')}
                            <div className="col-2 col-offset-5">
                                <Button type="submit" icon="pi pi-save" label="Guardar" severity="info"  />                                                
                            </div>
                        </form>    
                </div>
        </div>
    </div>
  )
}


export default User;
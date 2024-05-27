import { UserService } from "../../services/UserService";
import { App } from "@/types";
import {  useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";


const User = () => {

    let emptyUser: App.UserType= {        
        firstName: '',
        lastName: '',
        email: '',
        password : '',
        isAdmin: false
    };

    const navigate = useNavigate();

    const {id} = useParams();    
    
    const [user, setUser] = useState(emptyUser);
 
    useEffect(() => {        
        {id && (
            UserService.getUser(id)
           .then((data) => {
                    setUser(data as any);
           })                  
            .catch( (error) => console.log(error))

            // .then((res) =>{
            //     if (res?.status == 409){                
            //        toast.current?.show({
            //            severity: 'error',
            //            summary: 'Borrado',
            //            detail: 'Usero no puede ser eliminado',
            //            life: 3000
            //        });        
            //        hideDeleteUserDialog();            
        )};    
    }, []);


    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {                
        e.preventDefault();
        const name = e.target.name;
        const val = (e.target && e.target.value) || '';
        let _user = { ...user };        
        _user[`${name}`] = val;
        setUser(_user);
    };

    const onIsAdminChange = (e : CheckboxChangeEvent) => {
        let isChecked = e.checked || false;
        let _user = { ...user, isAdmin : isChecked};      
        setUser(_user);        
    }
    
    const handleSave = (e : any) => {
        e.preventDefault();
        if (id){
            UserService.updateUser(id, user).then((data) => {setUser(data as any); navigate(-1);})
            
        } else {
            UserService.createUser(user).then((data) => {setUser(data as any); navigate(-1);})
        }
    }

  return (
    <div className="grid">
            <div className="col-12">
                <div className="flex justify-content-start align-items-baseline">
                    <Button className="mr-2"  icon="pi pi-chevron-left" rounded text onClick={() => navigate('/users')} />                    
                    <h5>{id ? 'Editar' : 'Nuevo'} Usuario</h5>
                </div>
                <div className="card p-fluid">                   
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-6">
                                <label htmlFor="firstName" className="">Nombre</label>                        
                                <InputText id="user.firstName" name="firstName"  value={user.firstName} autoFocus type="text" onChange={onInputChange} />
                            </div>
                            <div className="field col-12">                    
                                <label htmlFor="lastName" className="">Apellidos</label>
                                <InputText id="user.lastName" name="lastName"  value={user.lastName} type="text" onChange={onInputChange} />
                            </div>
                            <div className="field col-12">                    
                                <label htmlFor="email" className="">Email</label>                    
                                <InputText id="user.email" name="email"  value={user.email} type="text" onChange={onInputChange} />
                            </div>                                                          
                            <div className="field col-12">                    
                                <label htmlFor="password" className="">Contraseña</label>                    
                                <Password inputId="user.password" name="password" toggleMask={true} feedback={false} onChange={onInputChange}  className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem" />
                            </div>                            
                            <div className="field col-12 flex flex-align-center">                    
                                <label htmlFor="isAdmin" className=" mr-3">Administrador</label>                    
                                <Checkbox inputId="user.isAdmin" name="isAdmin" onChange={onIsAdminChange} checked={user.isAdmin} />
                            </div>                                                          

                        </div>
                        <div className="col-2 col-offset-5">
                                <Button type="submit" icon="pi pi-save" label="Guardar" severity="info" onClick={handleSave} />                    
                        </div>

                </div>
            </div>        
    </div>
  )
}


export default User;
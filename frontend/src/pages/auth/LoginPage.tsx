import { useContext, useRef } from 'react';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import AppConfig from '../../layout/AppConfig';
import { LoginService } from '../../services/LoginService';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { App } from '@/types/app';
import { Controller, useForm } from 'react-hook-form';

const LoginPage = () => {

    const defaultValues : App.LoginType = {
         email : '',
         password : ''
     };

    const {login} =  useContext(AuthContext);

    const navigate = useNavigate();


    const toast = useRef<Toast>(null);
    const { layoutConfig } = useContext(LayoutContext);
    
    const { control, formState: { errors }, handleSubmit} = useForm<App.LoginType>({ defaultValues });

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });


    const getFormErrorMessage = (name : string) => {
        return errors[name] && <small className="p-error">{errors[name]?.message}</small>
    };
    
    const onSubmit = (data : App.LoginType) => {      
        LoginService.login(data)
            .then((data) => {                            
                if (data.status == 401){                
                    toast.current?.show({
                    severity: 'error',
                    summary: 'Error de acceso',
                    detail: 'Usuario o contraseña incorrectos',
                    life: 3000
                    });        
                } else {                        
                    login(data.token);
                    navigate('/');
                }
            });        
    }
      
    return (
        <>
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <Toast ref={toast} position='bottom-center'/>
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                        <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="GesLic" className="mb-5 w-6rem flex-shrink-0" />                            
                            <div className="text-900 text-3xl font-medium mb-3">Bienvenido a GesLic</div>
                            <span className="text-600 font-medium">Introduce usuario</span>
                        </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                        <div className="mb-5">
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="email" control={control} rules={{ required: 'Email obligatorio.', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Email inválido. Ej: usuario@email.com' }}}
                                    render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )} />
                                    <label htmlFor="email" className={classNames({ 'p-error': errors.email })}>Email*</label>
                                </span>
                                {getFormErrorMessage('email')}
                            </div>
                        </div>
                        <div className="mb-5">
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="password" control={control} rules={{ required: 'Password obligatorio' }} render={({ field, fieldState }) => (
                                        <Password id={field.name} {...field} toggleMask feedback={false} className={classNames({ 'p-invalid': fieldState.invalid })}  />                                                                
                                    )} />
                                    <label htmlFor="password" className={classNames({ 'p-error': errors.password })}>Contraseña*</label>
                                </span>
                                {getFormErrorMessage('password')}
                            </div>                            
                        </div>
                        <Button type="submit" label="Entrar" className="w-full p-3 text-xl" />
                    </form>
                    </div>
                    
                </div>
            </div>
        </div>
         <AppConfig simple />
         </>
    );
};

export default LoginPage;
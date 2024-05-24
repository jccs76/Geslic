
import { useContext, useRef, useState } from 'react';
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

const LoginPage = () => {

    // const defaultValues : App.LoginType = {
    //     email : '',
    //     password : ''
    // };

    const {login} =  useContext(AuthContext);

    const navigate = useNavigate();

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const toast = useRef<Toast>(null);
    const { layoutConfig } = useContext(LayoutContext);

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    // const validate = (data : App.LoginType) => {
    //     let errors = { email : '', password: ''};

    //     if (!data.email) {
    //         errors.email = 'E-mail obligatorio';
    //     }  else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
    //         errors.email = 'Email incorrecto. Ej: usuario@email.com';
    //     }

    //     if (!data.password) {
    //         errors.password= 'Password obligatorio';
    //     }
      
    //     return errors;
    // };

  
    const handleLogin = () => { 
            if (!loginEmail || !loginPassword) { 
                return; 
            }
            let credentials = { email : loginEmail,  password : loginPassword }; 
            LoginService.login(credentials).then((data) => 
                {
                    
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

                })
    }; 
    
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
                            <div className="text-900 text-3xl font-medium mb-3">GesLic</div>
                            <span className="text-600 font-medium">Introduzca usuario</span>
                        </div>

                        <div className="mb-5">
                            <label htmlFor="loginEmail" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <InputText id="loginEmail" type="text" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Correo Electrónico" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />                            
                            <label htmlFor="loginPassword" className="block text-900 font-medium text-xl mb-2">
                                Contraseña
                            </label>
                            <Password inputId="loginPassword" toggleMask={true} feedback={false} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}  placeholder="Contraseña" className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem" />                            
                        </div>
                     

                        <Button label="Entrar" className="w-full p-3 text-xl" onClick={handleLogin}></Button>
                    </div>
                </div>
            </div>
        </div>
         <AppConfig simple />
         </>
    );
};

export default LoginPage;
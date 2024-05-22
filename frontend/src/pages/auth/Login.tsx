
import { useContext, useState } from 'react';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import AppConfig from '../../layout/AppConfig';

const Login = () => {
    const [password, setPassword] = useState('');

    const { layoutConfig } = useContext(LayoutContext);

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    return (
        <>
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                
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
                            <span className="text-600 font-medium">Introduzca su usuario</span>
                        </div>

                        <div className="mb-5">
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <InputText id="email1" type="text" placeholder="Correo Electrónico" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Contraseña
                            </label>
                            <Password inputId="password1" toggleMask={true} feedback={false} value={password} onChange={(e) => setPassword(e.target.value)}  placeholder="Contraseña" className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem" />
                                                        
                        </div>
                        <Button label="Entrar" className="w-full p-3 text-xl"></Button>
                    </div>
                </div>
            </div>
        </div>
         <AppConfig simple />
         </>
    );
};

export default Login;

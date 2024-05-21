/* eslint-disable @next/next/no-img-element */

import { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '@/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: 'Inicio',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Gestion',
            items: [
                { label: 'Clientes', icon: 'pi pi-fw pi-id-card', to: '/customers' },
                { label: 'Productos', icon: 'pi pi-fw pi-box', to: '/products' },
                { label: 'Licencias', icon: 'pi pi-fw pi-key', to: '/licenses' },                
                { label: 'Mantenimientos', icon: 'pi pi-fw pi-briefcase',to: '/supports'}
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;

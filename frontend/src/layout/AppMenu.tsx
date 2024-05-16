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
                { label: 'Clientes', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
                { label: 'Productos', icon: 'pi pi-fw pi-box', to: '/uikit/input' },
                { label: 'Licencias', icon: 'pi pi-fw pi-key', to: '/uikit/floatlabel' },
            ]
        },
        {
            label: 'Procesos',
            items: [
                { label: 'Alta Licencia', icon: 'pi pi-fw pi-file-plus', to: '/blocks', badge: 'NEW' },
                { label: 'Cancelar Mantenimiento', icon: 'pi pi-fw pi-times', url: 'https://blocks.primereact.org', target: '_blank' }
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

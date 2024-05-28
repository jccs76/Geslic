import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { App } from '@/types';
import { UserService } from '../../services/UserService';
import { useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';



/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Users = () => {

    let emptyUser: App.UserType = {        
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        isAdmin: false
    };


    const [deleteUserDialog, setDeleteUserDialog] = useState(false);

    const [user, setUser] = useState<App.UserType | null>(null);
    const [users, setUsers] = useState<App.UsersType | null>(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);



    useEffect(() => {
        UserService.getUsers().then((data) => {
            setUsers(data);
        });
    }, []);

    const openNew = () => {
        navigate('/user');
    };

    const editUser = (rowData: App.UserType) => {
        navigate('/user/' + rowData?.id );
        
    };

    const confirmDelete = (user: App.UserType) => {
        setUser(user);
        setDeleteUserDialog(true);        
    };


    const deleteUser = () => {
        
        UserService.deleteUser(user?.id)
        .then((res) =>{
             if (res?.status == 409){                
                toast.current?.show({
                    severity: 'error',
                    summary: 'Borrado',
                    detail: 'Usuario no puede ser eliminado',
                    life: 3000
                });        
                hideDeleteUserDialog();
            } else {
                let _users = (users as any)?.filter((val: any) => val.id !== user?.id);
                setUsers(_users);
                hideDeleteUserDialog();
                setUser(emptyUser);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Borrado',
                    detail: 'Usuario Eliminado',
                    life: 3000
                });        
            }
        });
            
    };

    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    };

    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteUserDialog} />
            <Button label="Sí" icon="pi pi-check" text onClick={deleteUser} />
        </>
    );

    
    const toolbarStartContent = ( 
        <div className="flex justify-content-start align-items-baseline">
            <Button className="mr-2"  icon="pi pi-chevron-left" rounded text onClick={() => navigate('/')} />                       
            <h5 className="mt-3">Gestión de Usuarios</h5>        
        </div>
    );

    const toolbarCenterContent = (
        <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
            <i className="pi pi-search" />
        </span>
        <InputText className="pl-2" type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Buscar..." />
    </div>
    );

    const toolbarEndContent = (
        // <div className="flex-grow m-2">
            <Button label="Nuevo" icon="pi pi-plus" severity="info" className=" mr-5" onClick={openNew} />
        // </div>            

    );
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-evenly md:align-items-center">
            <span>Usuarios</span>
        </div>
        
    );

    const actionBodyTemplate = (rowData: App.UserType) => {
        return (
            <div className="flex flex-column md:flex-row md:justify-content-center md:align-items-center ">
                <Button icon="pi pi-pencil" tooltip="Modificar" rounded severity="info"  className="mr-2" onClick={() => editUser(rowData)} />
                <Button icon="pi pi-trash" tooltip="Eliminar" rounded severity="warning" disabled={rowData.email == "admin@geslic.com"} onClick={() => confirmDelete(rowData)}/>
            </div>
        );
    };



    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" start={toolbarStartContent} center={toolbarCenterContent} end={toolbarEndContent}/>

                    <DataTable
                        ref={dt}
                        value={users}                        
                        selection={selectedUser}
                        onSelectionChange={(e) => setSelectedUser(e.value as any)}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        showGridlines 
                        stripedRows
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
                        globalFilter={globalFilter}
                        emptyMessage="No hay usuarios."
                        header={header}
                    >
                        <Column field="firstName" header="Nombre" headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="lastName" header="Apellidos" headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="email" header="E-mail"></Column>


                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>
                    <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteProductDialogFooter} onHide={hideDeleteUserDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {user && (
                                <span>
                                   ¿Seguro que quiere eliminar el usuario <b>{user?.firstName} {user?.lastName}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
    
                </div>
            </div>
        </div>
    );
};

export default Users;
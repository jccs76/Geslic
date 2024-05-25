import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { App } from '@/types';
import { CustomerService } from '../../services/CustomerService';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';




/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Customers = () => {

    let emptyCustomer: App.CustomerType = {
        id: '',
        name: ''        
    };


    //const { customers } = useContext(CustomerContext);
    const [deleteCustomerDialog, setDeleteCustomerDialog] = useState(false);

    const [customer, setCustomer] = useState<App.CustomerType | null>(null);
    const [customers, setCustomers] = useState<App.CustomersType | null>(null);
    const navigate = useNavigate();
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    const {id} = useParams();

    useEffect(() => {
        if (!id) {
            CustomerService.getCustomers().then((data) => setCustomers(data));        
        } else {
            CustomerService.getCustomer(id).then((data) => {
                let _customers : App.CustomersType = [data];
                setCustomers(_customers);
            });                    
        }
    }, []);

    const openNew = () => {
        navigate('/customer');
    };

    const editCustomer = (c: App.CustomerType) => {
        navigate('/customer/' + c?.id );        
    };

    const viewLicenses = (c: App.CustomerType) => {
        navigate('/customer/' + c?.id + '/licenses', {state : c} );
    }

    const confirmDelete = (cust: App.CustomerType) => {
        setCustomer(cust);
        setDeleteCustomerDialog(true);        
    };


    const deleteCustomer = () => {
        CustomerService.deleteCustomer(customer?.id);
        let _customers = (customers as any)?.filter((val: any) => val.id !== customer?.id);
        setCustomers(_customers);
        hideDeleteCustomerDialog();
        setCustomer(emptyCustomer);
        toast.current?.show({
            severity: 'success',
            summary: 'Borrado',
            detail: 'Cliente Eliminado',
            life: 3000
        });
    };

    const hideDeleteCustomerDialog = () => {
        setDeleteCustomerDialog(false);
    };

    const deleteCustomerDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteCustomerDialog} />
            <Button label="Sí" icon="pi pi-check" text onClick={deleteCustomer} />
        </>
    );

    
    const toolbarStartContent = (    
        <div className="flex justify-content-start align-items-baseline">
            <Button className="mr-2"  icon="pi pi-chevron-left" rounded text onClick={() => navigate('/')} />                    
            <h5 className="mt-3">Gestión de Clientes</h5> 
        </div>       
    );

    const toolbarCenterContent = (
        <div></div>
    //     <div className="p-inputgroup">
    //     <span className="p-inputgroup-addon">
    //         <i className="pi pi-search" />
    //     </span>
    //     <InputText className="pl-2" type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Buscar..." />
    // </div>
    );

    const toolbarEndContent = (
        // <div className="flex-grow m-2">
            <Button label="Nuevo" icon="pi pi-plus" severity="info" className=" mr-5" onClick={openNew} />
        // </div>            

    );

    const header = (        
        <div className="flex flex-column md:flex-row md:justify-content-evenly md:align-items-baseline">
            <h5 className="flex-grow-1 ">Clientes</h5>
            <IconField iconPosition="left" >
                <InputIcon className="pi pi-search" />
                <InputText type="search"  onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Buscar..." />
            </IconField>
        </div>
    );

    const actionBodyTemplate = (rowData: App.CustomerType) => {
        return (
            <div className="flex flex-column md:flex-row md:justify-content-center md:align-items-center ">
                <Button icon="pi pi-pencil" tooltip="Modificar" rounded severity="info"  className="mr-2" onClick={() => editCustomer(rowData)} />
                <Button icon="pi pi-trash" tooltip="Eliminar" rounded severity="warning"  className="mr-2" onClick={() => confirmDelete(rowData)}/>
                <Button icon="pi pi-book"  tooltip="Licencias" rounded severity="secondary"  className="mr-2" onClick={() => viewLicenses(rowData)} />
            </div>
        );
    };

    const nameBodyTemplate = (rowData: App.CustomerType) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData?.name}
            </>
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
                        value={customers}
                        dataKey="id"                        
                        selection={customer}
                        onSelectionChange={(e) => setCustomer(e.value as any)}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        showGridlines 
                        stripedRows
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
                        globalFilter={globalFilter}
                        emptyMessage="No hay clientes."
                        header={header}
                    >
                        {/* <Column field="id" header="Id"  headerStyle={{ minWidth: '3rem' }}></Column> */}
                        <Column field="name" header="Nombre" body={nameBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="email" header="Email" headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="phoneNumber" header="Teléfono" headerStyle={{ minWidth: '4rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '2rem' }}></Column>                        
                    </DataTable>

                    <Dialog visible={deleteCustomerDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteCustomerDialogFooter} onHide={hideDeleteCustomerDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {customer && (
                                <span>
                                   ¿Seguro que quiere eliminar el cliente <b>{customer.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
    
                </div>
            </div>
        </div>
    );
};

export default Customers;
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { useEffect, useRef, useState } from 'react';
import Layout from "../../layout/layout";
import { App } from '@/types';
import { CustomerService } from '../../services/CustomerService';

import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';



/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Customers = () => {

    let emptyCustomer: App.Customer = {
        id: '',
        name: ''
    };

    const [customer, setCustomer] = useState<App.Customer>(emptyCustomer);
    const [customers, setCustomers] = useState(null);
    const [selectedCustomers, setSelectedCustomers] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {        
        CustomerService.getCustomers().then((data) => setCustomers(data as any));
    }, []);

    const openNew = () => {
        return;
    };

    const editCustomer = (customer: App.Customer) => {
        setCustomer({ ...customer });
        
    };

    const confirmDelete = (customer: App.Customer) => {
        setCustomer(customer);
        showDeleteDialog();
    }

    const hideDeleteDialog = () => {
        setDeleteDialog(false);
    };

    const deleteCustomer = () => {
        let _customers = (customers as any)?.filter((val: any) => val.id !== customer.id);
        setCustomers(_customers);
        CustomerService.deleteCustomer(customer.id).then((data) => setCustomer(data as any));
        setDeleteDialog(false);
        setCustomer(emptyCustomer);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Cliente Eliminado',
            life: 3000
        });
    };

    const showDeleteDialog = () => {
        confirmDialog({
            message: '¿Seguro que quiere borrar el cliente?',
            header: 'Confirmar Borrado',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept : deleteCustomer,
            reject: hideDeleteDialog
        });
    };

    
    const toolbarStartContent = (    
            <h5 className="mt-3">Gestión de Clientes</h5>        
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
            <span>Clientes</span>
        </div>
        
    );

    const actionBodyTemplate = (rowData: App.Customer) => {
        return (
            <div className="flex flex-column md:flex-row md:justify-content-center md:align-items-center ">
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editCustomer(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDelete(rowData)}/>
            </div>
        );
    };

    const nameBodyTemplate = (rowData: App.Customer) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.name}
            </>
        );
    };


    return (
        <Layout>

        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" start={toolbarStartContent} center={toolbarCenterContent} end={toolbarEndContent}/>

                    <DataTable
                        ref={dt}
                        value={customers}
                        selection={selectedCustomers}
                        onSelectionChange={(e) => setSelectedCustomers(e.value as any)}
                        dataKey="id"
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
                        <Column field="name" header="Nombre" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '30rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>
                    <ConfirmDialog />
    
                </div>
            </div>
        </div>
        </Layout>
    );
};

export default Customers;
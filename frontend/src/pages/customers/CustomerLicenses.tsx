import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';

import { App } from '@/types';

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CustomerService } from '../../services/CustomerService';
import { LicenseService } from '../../services/LicenseService';

import { getStatusText } from '../../common/SupportStatus';
import { formatCurrencyES, formatDateEs } from '../../util/Util';


const CustomerLicenses = () => {

    let emptyLicense: App.LicenseType = {
        code: ''
    };
    
    const {id} = useParams(); 
    const location = useLocation();  

    const [deleteLicenseDialog, setDeleteLicenseDialog] = useState(false);

    const [license, setLicense] = useState<App.LicenseType>(emptyLicense);
    const [licenses, setLicenses] = useState(null);
    const [selectedLicenses, setSelectedLicenses] = useState<App.LicenseType>(emptyLicense);
    const navigate = useNavigate();
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {        
        {id && (
            CustomerService.getCustomerLicenses(id).then((data) => setLicenses(data as any))
        )};    
    }, []);

    const openNew = () => {
        navigate('/license');
    };

    const editLicense = (c: App.LicenseType) => {

        navigate('/license/' + c?.id );
        
    };

    const confirmDelete = (cust: App.LicenseType) => {
        setLicense(cust);
        setDeleteLicenseDialog(true);        
    };


    const deleteLicense = () => {
        if (license) {
            LicenseService.deleteLicense(license?.id);
            let _licenses = (licenses as any)?.filter((val: any) => val.id !== license.id);
            setLicenses(_licenses);
            hideDeleteLicenseDialog();
            setLicense(emptyLicense);
            toast.current?.show({
                severity: 'success',
                summary: 'Borrado',
                detail: 'Licencia Eliminado',
                life: 3000
            });
        }
    };

    const hideDeleteLicenseDialog = () => {
        setDeleteLicenseDialog(false);
    };

    const deleteLicenseDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteLicenseDialog} />
            <Button label="Sí" icon="pi pi-check" text onClick={deleteLicense} />
        </>
    );

    
    const toolbarStartContent = (
        <div className="flex justify-content-start align-items-baseline">
            <Button className="mr-2"  icon="pi pi-chevron-left" rounded text onClick={() => navigate('/customers')} /> 
            <h5 className="mt-3">Licencias de {location.state.name}</h5>
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
            <span>Licencias</span>
        </div>
        
    );

    const actionBodyTemplate = (rowData: App.LicenseType) => {
        return (
            <div className="flex flex-column md:flex-row md:justify-content-center md:align-items-center ">
                <Button icon="pi pi-pencil" rounded severity="success"  className="mr-2" onClick={() => editLicense(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning"  onClick={() => confirmDelete(rowData)}/>
            </div>
        );
    };

    
    const nameBodyTemplate = (rowData: App.LicenseType) => {
        return (            
            <Button link label={rowData?.code} className="text-color" onClick={() => navigate('/licenses/' + rowData?.id) }/>            
        );
    };
    
    const priceBodyTemplate = (rowData: App.LicenseType) => {
        if (rowData?.price){
            return formatCurrencyES(rowData?.price)
        }        
    };

    const purchaseDateBodyTemplate = (rowData: App.LicenseType) => {
        if (rowData?.purchaseDate){
            return formatDateEs(rowData?.purchaseDate)
        }        
    };


    const statusBodyTemplate = (rowData: App.LicenseType) => {
        const labelText = getStatusText (rowData?.lastSupport?.status);
        return (
                <Button link label={labelText} className={`support-badge support-${rowData?.lastSupport?.status.toLowerCase()}`}
                onClick={() => navigate('/license/' + rowData?.id + '/support' )}
                />
        );
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" start={toolbarStartContent} center={toolbarCenterContent} end={toolbarEndContent}/>

                    <DataTable
                        ref={dt}
                        value={licenses}                        
                        selection={selectedLicenses}
                        onSelectionChange={(e) => setSelectedLicenses(e.value as any)}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        showGridlines 
                        stripedRows
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
                        globalFilter={globalFilter}
                        emptyMessage="No hay licencias."
                        header={header}
                    >
                        <Column field="code" header="Nº Serie" body={nameBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="product.name" header="Producto"  headerStyle={{ minWidth: '4rem' }}></Column>
                        <Column field="purchaseDate" header="FechaCompra" body={purchaseDateBodyTemplate} headerStyle={{ minWidth: '2rem'}} className='text-center'></Column>
                        <Column field="price" header="Precio" body={priceBodyTemplate}  headerStyle={{ minWidth: '2rem'}} className='text-right'></Column>
                        <Column field="support.status" header="Estado" body={statusBodyTemplate} headerStyle={{ minWidth: '3rem' }} className='text-center'></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        
                    </DataTable>
                    <Dialog visible={deleteLicenseDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteLicenseDialogFooter} onHide={hideDeleteLicenseDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {license && (
                                <span>
                                   ¿Seguro que quiere eliminar la licencia <b>{license.name as any}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
    
                </div>
            </div>
        </div>

    );
};

export default CustomerLicenses;
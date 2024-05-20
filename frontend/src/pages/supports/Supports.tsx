import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import Layout from "../../layout/layout";
import { App } from '@/types';
import { LicenseService } from '../../services/LicenseService';
import { useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { SupportStatus } from '../../common/SupportStatus';




/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Supports = () => {

    let emptyLicense: App.LicenseType = {
        code: '',
        lastSupport: {
            status: '',
            toDate: ''
        }
    };

    let emptyLicenses = [emptyLicense];

    const Action = {
        RENEW  : 'renovar',
        CANCEL : 'cancelar'
    }

    const [licenses, setLicenses] = useState<App.LicensesType>(emptyLicenses);
    const [license, setLicense] = useState<App.LicenseType>(emptyLicense);
    const [selectedRow, setSelectedRow] = useState(null);
    const [supportDialog, setSupportDialog] = useState(false);
    const [action, setAction] = useState('');
    const navigate = useNavigate();
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        LicenseService.getLicenses().then((data) => setLicenses(data as any));
    }, []);

    const formatDateEs = (value: string | Date) => {
        return new Date(value).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
    
    
    const renewSupport = () => {
        if (license){
            LicenseService.renewSupport(license.id).then((data) => {                
                console.log(license);
                if (licenses){
                    licenses.map(item => item?.id === license.id ? {data} : item);
                }
            });
        };
        hideSupportDialog();
    };

    const cancelSupport = () => {
        if (license){
            LicenseService.cancelSupport(license.id);                        
            license.lastSupport.status = SupportStatus.CANCELED;
            if (licenses){
                licenses.map(item => item?.id === license.id ? {license} : item);
            }
        };
        hideSupportDialog();
    };

    const showSupportDialog = (lic: App.LicenseType, act : string) => {
        setLicense(lic);
        setAction(act);
        setSupportDialog(true);        
    };

    const hideSupportDialog = () => {
        setSupportDialog(false);
    };
    const toolbarStartContent = (    
            <h5 className="mt-3">Gestión de Mantenimientos</h5>        
    );

    const toolbarCenterContent = (
        <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
            <i className="pi pi-search" />
        </span>
        <InputText className="pl-2" type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Buscar..." />
    </div>
    );

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-evenly md:align-items-center">
            <span>Mantenimientos</span>
        </div>
        
    );

    const actionBodyTemplate = (rowData: App.LicenseType) => {        
        return (
            <div className="flex flex-column md:flex-row md:justify-content-center md:align-items-center ">
                <Button icon="pi pi-replay" label="Renovar" rounded severity="success"  className="mr-2" onClick={() => showSupportDialog(rowData, Action.RENEW)} />
                
                <Button icon="pi pi-times" label="Cancelar" rounded severity="warning" disabled={rowData?.lastSupport?.status == SupportStatus.CANCELED}  onClick={() => showSupportDialog(rowData, Action.CANCEL)}/>
                
            </div>
        );
    };

    const nameBodyTemplate = (rowData: App.LicenseType) => {
        return (
            <>
                <span className="p-column-title">Nº Serie</span>
                {rowData?.code}
            </>
        );
    };

    const toDateBodyTemplate = (rowData: App.LicenseType) => {
        return formatDateEs(rowData?.lastSupport.toDate);
        
    };

    const statusBodyTemplate = (rowData: App.LicenseType) => {
        return <span className={`support-badge support-${rowData?.lastSupport?.status.toLowerCase()}`}>{(() => {
            switch (rowData?.lastSupport?.status) {
              case SupportStatus.ACTIVE:
                return 'EN VIGOR'
              case SupportStatus.CANCELED:
                return 'CANCELADA'
              case SupportStatus.EXPIRED:
                return 'EXPIRADA'
              default:
                return null
            }
          })() }</span>;
        
    };

    const supportDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideSupportDialog} />
            {action == 'cancelar' ?
                <Button label="Sí" icon="pi pi-check" text onClick={cancelSupport} />
                :
                <Button label="Sí" icon="pi pi-check" text onClick={renewSupport} />
            }
            
        </>
    );

    return (
        <Layout>
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" start={toolbarStartContent} center={toolbarCenterContent} />

                    <DataTable
                        ref={dt}
                        value={licenses}                        
                        selection={selectedRow}
                        onSelectionChange={(e) => setSelectedRow(e.value as any)}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        showGridlines 
                        stripedRows
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
                        globalFilter={globalFilter}
                        emptyMessage="No hay mantenimientos."
                        header={header}
                    >                        
                        <Column field="id" header="Id"  headerStyle={{ minWidth: '3rem' }}></Column>
                        <Column field="code" header="Nº Serie" body={nameBodyTemplate} headerStyle={{ minWidth: '12rem' }}></Column>
                        <Column field="lastSupport.toDate" header="Hasta" body={toDateBodyTemplate} headerStyle={{ minWidth: 'rem' }}></Column>
                        <Column field="lastSupport.status"  header="Estado" body={statusBodyTemplate} headerStyle={{ minWidth: '3rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        
                    </DataTable>
                    <Dialog visible={supportDialog} style={{ width: '450px' }} header="Confirmar" modal footer={supportDialogFooter} onHide={hideSupportDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {license && (
                                <span>
                                   ¿Seguro que quiere {action} el mantenimiento de la licencia <b>{license.code}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
    
                </div>
            </div>
        </div>
    </Layout>

    );
};

export default Supports;
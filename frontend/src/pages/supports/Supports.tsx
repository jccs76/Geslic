import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { App } from '@/types';
import { LicenseService } from '../../services/LicenseService';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { SupportStatus } from '../../common/SupportStatus';
import { formatCurrencyES } from '../../util/Util';




/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Supports = () => {


    const Action = {
        RENEW  : 'renovar',
        CANCEL : 'cancelar'
    }

    const {id} = useParams();    

    const [licenses, setLicenses] = useState<App.LicensesType | null>(null);
    const [license, setLicense] = useState<App.LicenseType | null>(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [supportDialog, setSupportDialog] = useState(false);
    const [action, setAction] = useState('');
    const navigate = useNavigate();
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        if (!id){                    
            LicenseService.getLicenses().then((data) => setLicenses(data));
        } else {
            
            LicenseService.getLicense(id).then((data) => {
                let _licenses : App.LicensesType = [data];
                setLicenses(_licenses);
            });
        }
    }, []);

    const formatDateEs = (value: string | Date) => {
        return new Date(value).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
    
    
    const renewSupport = (e : any) => {        
        e.preventDefault();
        if (license){
            LicenseService.renewSupport(license.id).then((data) => {            
                if (licenses){
                   let _licenses : any  = licenses.map((item : any) => item?.id === license.id ? data : item);
                  setLicenses(_licenses);
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
                licenses.map((item : App.LicenseType) => item?.id === license.id ? {license} : item);
            }
        };
        hideSupportDialog();
    };

    const editSupport = (c: App.LicenseType) => {
        navigate('/support/' + c?.lastSupport?.id);
    }

    const showSupportDialog = (lic: App.LicenseType, act : string) => {
        setLicense(lic);
        setAction(act);
        setSupportDialog(true);        
    };

    const hideSupportDialog = () => {
        setSupportDialog(false);
    };
    const toolbarStartContent = ( 
        <div className="flex justify-content-start align-items-baseline">
            <Button className="mr-2"  icon="pi pi-chevron-left" rounded text onClick={() => navigate('/')} />                       
            <h5 className="mt-3">Gestión de Mantenimientos</h5>
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

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-evenly md:align-items-center">
            <span>Mantenimientos</span>
        </div>
        
    );

    const actionBodyTemplate = (rowData: App.LicenseType) => {        
        return (
            <div className="flex flex-column md:flex-row md:justify-content-center md:align-items-center ">
                <Button icon="pi pi-replay" tooltip="Renovar" rounded severity="success"  className="mr-2" onClick={() => showSupportDialog(rowData, Action.RENEW)} />                            
                <Button icon="pi pi-times" tooltip="Cancelar" rounded severity="danger" className="mr-2" disabled={rowData?.lastSupport?.status == SupportStatus.CANCELED}  onClick={() => showSupportDialog(rowData, Action.CANCEL)}/>
                <Button icon="pi pi-pencil" tooltip="Modificar" rounded severity="info"  disabled={rowData?.lastSupport?.status == SupportStatus.CANCELED} onClick={() => editSupport(rowData)} />
                
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

    const toFromDateBodyTemplate = (rowData: App.LicenseType) => {
        return formatDateEs(rowData?.lastSupport.fromDate);
        
    };

    const toDateBodyTemplate = (rowData: App.LicenseType) => {
        return formatDateEs(rowData?.lastSupport.toDate);
        
    };

    const priceBodyTemplate = (rowData: App.LicenseType) => {
        if (rowData?.price){
            return formatCurrencyES(rowData?.lastSupport.price);
        }        
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
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" start={toolbarStartContent} center={!id && toolbarCenterContent} />

                    <DataTable
                        ref={dt}
                        value={licenses}  
                        dataKey="id"                      
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
                        <Column field="code" header="Nº Serie" body={nameBodyTemplate} headerStyle={{ minWidth: '12rem' }}></Column>
                        <Column field="lastSupport.fromDate" header="Desde" body={toFromDateBodyTemplate} headerStyle={{ minWidth: 'rem' }} className='text-center'></Column>
                        <Column field="lastSupport.toDate" header="Hasta" body={toDateBodyTemplate} headerStyle={{ minWidth: 'rem' }} className='text-center'></Column>
                        <Column field="lastSupport.price" header="Precio" body={priceBodyTemplate}  headerStyle={{ minWidth: '2rem'}} className='text-right'></Column>
                        <Column field="lastSupport.status"  header="Estado" body={statusBodyTemplate} headerStyle={{ minWidth: '3rem' }} className='text-center'></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        
                    </DataTable>
                    {id &&
                            <div className="col-2 col-offset-5 mt-5">
                                <Button type="button" icon="pi pi-chevron-left" severity="secondary"  label="Volver"  onClick={() => navigate(-1)} />                    
                            </div>
                
                    }
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
    );
};

export default Supports;
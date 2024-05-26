import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { App } from "@/types";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { LicenseService } from "../../services/LicenseService";
import { SupportStatus } from "../../common/SupportStatus";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { convertDatetoISOString, formatCurrencyES, getFirstDayOfMonth, getLastDayOfMonth } from "../../util/Util";
import { Toolbar } from "primereact/toolbar";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";

export const Dashboard =() => {

    const Action = {
        RENEW  : 'renovar',
        CANCEL : 'cancelar'
    }

    const {id} = useParams();    

    const [licenses, setLicenses] = useState<App.LicensesType | null>(null);
    const [license, setLicense] = useState<App.LicenseType>(null);

    const [searchFromDate, setSearchFromDate] = useState<Nullable<Date>>(null);
    const [searchToDate, setSearchToDate] = useState<Nullable<Date>>(null);

    const [selectedRow, setSelectedRow] = useState(null);
    const [supportDialog, setSupportDialog] = useState(false);
    const [action, setAction] = useState('');
    const navigate = useNavigate();
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
            setSearchFromDate(getFirstDayOfMonth(new Date()));
            setSearchToDate(getLastDayOfMonth(new Date()));
            LicenseService.getLicensesSupportThisMonth().then((data) => setLicenses(data as any));
    }, []);

    useEffect(() => {
        if (searchFromDate && searchToDate) {
            if (searchFromDate > searchToDate){
                setSearchFromDate(searchToDate);
            }
            LicenseService.getLicensesSupportBetweenDates(convertDatetoISOString(searchFromDate), 
                                                          convertDatetoISOString(searchToDate))
                          .then((data) => setLicenses(data));
        }        
    }, [searchFromDate]);

    useEffect(() => {
        if (searchFromDate && searchToDate) {
            if (searchToDate < searchFromDate){
                setSearchToDate(searchFromDate);
            }                    
            LicenseService.getLicensesSupportBetweenDates(convertDatetoISOString(searchFromDate), 
                                                          convertDatetoISOString(searchToDate))
                          .then((data) => setLicenses(data));
        }
    }, [searchToDate]);

    
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
              licenses.map(item => item?.id === license.id ? {license} : item);
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
          <h5 className="mt-3">Estado de Mantenimientos</h5>        
  );

  const toolbarEndContent = (
    <div className="flex gap-3">                                    

        <div className="flex-auto">
            <label htmlFor="searchFromDate" className="font-bold block mb-2">Desde</label>
            <Calendar id="searchFromDate" name="searchFromDate" selectionMode="single"  locale="es-ES"  value={searchFromDate} onChange={(e) => setSearchFromDate(e.value)} />
        </div>
        <div className="flex-auto">
            <label htmlFor="searchToDate" className="font-bold block mb-2">Hasta</label>
            <Calendar id="searchToDate" name="searchToDate" selectionMode="single"  locale="es-ES"  value={searchToDate} onChange={(e) => setSearchToDate(e.value)} />
        </div>
    </div>
    );

  const header = (        
    <div className="flex flex-column md:flex-row md:justify-content-evenly md:align-items-baseline">
        <h5 className="flex-grow-1 text-center">Mantenimientos</h5>
        <IconField iconPosition="left" >
            <InputIcon className="pi pi-search" />
            <InputText type="search"  onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Buscar..." />
        </IconField>
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
      <Button link label={rowData?.code} className="text-color" onClick={() => navigate('/licenses/' + rowData?.id) }/>
    );
  };

  const customerBodyTemplate = (rowData: App.LicenseType) => {
    return (
      <Button link label={rowData?.customer?.name}  className="text-color" onClick={() => navigate('/customers/' + rowData?.customer?.id) }/>
    );
  };

  const productBodyTemplate = (rowData: App.LicenseType) => {
    return (
      <Button link label={rowData?.product?.name}  className="text-color" onClick={() => navigate('/products/' + rowData?.product?.id) }/>
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
                  <Toolbar className="mb-4" start={toolbarStartContent} end={toolbarEndContent} />
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
                      <Column field="code" header="Nº Serie" body={nameBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                      <Column field="customer.name" header="Cliente" body={customerBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                      <Column field="product.name" header="Producto" body={productBodyTemplate}  headerStyle={{ minWidth: '4rem' }}></Column>
                      <Column field="lastSupport.fromDate" header="Desde" body={toFromDateBodyTemplate} headerStyle={{ minWidth: '2rem' }} className='text-center'></Column>
                      <Column field="lastSupport.toDate" header="Hasta" body={toDateBodyTemplate} headerStyle={{ minWidth: '2rem' }} className='text-center'></Column>
                      <Column field="lastSupport.price" header="Precio" body={priceBodyTemplate}  headerStyle={{ minWidth: '2rem'}} className='text-right'></Column>
                      <Column field="lastSupport.status"  header="Estado" body={statusBodyTemplate} headerStyle={{ minWidth: '8rem' }} className='text-center'></Column>
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


export default Dashboard;
import { LicenseService } from "../../services/LicenseService";
import { App } from "@/types";
import {  useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { CustomerService } from "../../services/CustomerService";
import { ProductService } from "../../services/ProductService";
import { InputNumber } from "primereact/inputnumber";
import { convertDatetoISOString, formatCurrencyES} from "../../util/Util";
import {Calendar} from "primereact/calendar";
import { Toast } from "primereact/toast";
import { Controller, useForm } from 'react-hook-form';
import { classNames } from "primereact/utils";


const License = () => {

    const defaultValues : { [key: string]: any }= {
        id : '',
        code : '',
        purchaseDate : null,
        price: 0,
        product: null,
        customer: null,
        lastSupport: null
    };

    const navigate = useNavigate();

    const {id} = useParams();    
    
    const toast = useRef<Toast>(null);
    
    const dtCustomers = useRef<DataTable<any>>(null);
    const dtProducts  = useRef<DataTable<any>>(null);
    
    const { control, formState: { errors }, handleSubmit, reset, setValue } = useForm({ defaultValues });

    const [customers, setCustomers] = useState<App.CustomersType>(null);
    const [customersFilter, setCustomersFilter] = useState('');
    const [customer, setCustomer] = useState<any>(null);
    const [products, setProducts] = useState<App.ProductsType>(null);
    const [productsFilter, setProductsFilter] = useState('');
    const [product, setProduct] = useState<any>(null);

    

    useEffect(() => {  
        CustomerService.getCustomers().then((data) => setCustomers(data));
        ProductService.getProducts().then((data) => setProducts(data));
        if (id){            
            LicenseService.getLicense(id).then((data) => {
                setFormData(data);
                setCustomer(data.customer);
                setProduct(data.product);            
            });
        }                
    }, []);



    const getFormErrorMessage = (name : string) => {
        return errors[name] && <small className="p-error">{errors[name]?.message as any}</small>
    };

    const setFormData = (dataLicense : any) => {        
        let formData = { id : dataLicense.id,
            code : dataLicense.code,
            purchaseDate : new Date(dataLicense.purchaseDate),
            price: dataLicense.price,
            product: dataLicense.product,
            customer: dataLicense.customer,
            lastSupport: dataLicense.lastSupport
        };
        reset(formData);
    }

    const getLicense = (data : any) : any => {
        let license = {id :data.id,
                        code : data.code,
                        purchaseDate : convertDatetoISOString(data.purchaseDate),
                        price : data.price,
                        product: data.product,
                        customer : data.customer,
                        lastSupport: data.lastSupport
                    };
        return license;
    }



    const onProductChange = (e : any) => {
        setProduct(e.value as any);
        setValue("price", e.value.price);
        setValue("product", e.value)
    }

    const onCustomerChange = (e : any) => {
        setCustomer(e.value as any);
        setValue("customer", e.value)
    }

    const onSubmit = (data : any) => {
      
        if (id){
            LicenseService.updateLicense(id, data).then((res) => {
                console.log(res);
                if (!res?.ok) {
                    if (res?.status == 409){
                        toast.current?.show({
                            severity: 'error',
                            summary: 'Ya existe',
                            detail: 'Ya hay una licencia con ese número de serie',
                            life: 3000
                        });
                    }        
                }else {                
                    navigate('/licenses');
                };
                
            })            
        } else {
            console.log(getLicense(data));
        LicenseService.createLicense(getLicense(data)).then((res) => {
            if (!res?.ok) {
                if (res?.status == 409){
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Ya existe',
                        detail: 'Ya hay una licencia con ese número de serie',
                        life: 3000
                    });
                }        
            }else {                
                navigate('/licenses');
            }        
        })
        }         
    }


    const headerCustomer = (
        <div className="flex gap-5 align-items-center">
            <h6 className="m-0">Cliente*</h6>
            <IconField iconPosition="left" >
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={(e) => setCustomersFilter(e.currentTarget.value)} placeholder="Buscar..." />
            </IconField>
        </div>
    );    

    const headerProduct = (
        <div className="flex gap-5 align-items-center">
            <h6 className="m-0">Producto*</h6>
            <IconField iconPosition="left" >
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={(e) => setProductsFilter(e.currentTarget.value)} placeholder="Buscar..." />
            </IconField>
        </div>
    );    

    const priceBodyTemplate = (rowData: App.ProductType) => {
        if (rowData?.price){
            return formatCurrencyES(rowData?.price)
        }
        
    };

  return (
    <div className="grid">
        <Toast ref={toast} />
            <div className="col-12">
                <div className="flex justify-content-start align-items-baseline">
                    <Button className="mr-2"  icon="pi pi-chevron-left" rounded text onClick={() => navigate("/licenses")} />                    
                    <h5>{id ? 'Editar' : 'Nueva'} Licencia</h5>
                </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="card p-fluid">                                        
                    <div className="p-fluid formgrid grid">
                 
                        <div className="field col-12 md:col-6">
                            <label htmlFor="code" className="">Nº Serie*</label>
                            <Controller name="code" control={control} rules={{required: 'Número de serie obligatorio.'}} render={({ field, fieldState }) => (                                                         
                                <InputText id={field.name} {... field} value={field.value} autoFocus type="text" className={classNames({ 'p-invalid': fieldState.invalid })} />   
                            )} />
                            {getFormErrorMessage('code')}
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="purchaseDate" className="">Fecha Compra*</label>
                            <Controller name="purchaseDate" control={control} rules={{required: 'Fecha de compra obligatoria.'}} render={({ field, fieldState }) => (                             
                                <Calendar id={field.name} ref={field.ref} onBlur={field.onBlur}  
                                value={field.value} onChange={(e) => field.onChange(e)} selectionMode="single"  locale="es-ES" mask="99/99/9999" showIcon showOnFocus={false}  className={classNames({ 'p-invalid': fieldState.invalid })} />
                            )} />
                            {getFormErrorMessage('purchaseDate')}
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="price" className="">Precio*</label>  
                            <Controller name="price" control={control} rules={{ required: 'Precio obligatorio.', min: {value : 1, message: 'Importe mayor que 0'}}}
                                        render={({ field, fieldState }) => (                      
                                <InputNumber id={field.name} ref={field.ref} onBlur={field.onBlur}  
                                value={field.value} onValueChange={(e) => field.onChange(e)} mode="currency" currency="EUR" locale="es-ES" inputClassName={classNames({ 'p-invalid': fieldState.error })}/>
                            )} />
                            {getFormErrorMessage('price')}
                        </div>
                    </div>                    
                </div>
                    <div className="card p-fluid">
                    <Controller name="product" control={control} rules={{ required: 'Seleccione un producto.'}}
                                        render={({}) => (                      
                    <DataTable
                        ref={dtProducts}
                        value={products}                        
                        selection={product}
                        onSelectionChange={(e) => {onProductChange(e)}}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        showGridlines 
                        stripedRows
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
                        globalFilter={productsFilter}
                        emptyMessage="No hay productos."
                        header={headerProduct}
                    >
                        <Column selectionMode="single" headerStyle={{ width: '4rem' }}></Column>                        
                        <Column field="name" header="Nombre" headerStyle={{ minWidth: '30rem' }}></Column>
                        <Column field="price" header="Precio" body={priceBodyTemplate}></Column>
                    </DataTable>
                    )} />
                    {getFormErrorMessage('product')}
                    </div>
                    <div className="card p-fluid">
                <Controller name="customer" control={control} rules={{ required: 'Seleccione un cliente.'}}
                                        render={({}) => (                      
                <DataTable
                        ref={dtCustomers}
                        value={customers}                        
                        selection={customer}
                        onSelectionChange={(e) => {onCustomerChange(e)}}                        
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        showGridlines 
                        stripedRows
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
                        globalFilter={customersFilter}                        
                        emptyMessage="No hay clientes."
                        header={headerCustomer}
                    >
                        <Column selectionMode="single" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="name" header="Nombre" headerStyle={{ minWidth: '30rem' }}></Column>
                    </DataTable>
                     )} />
                     {getFormErrorMessage('customer')}
                    </div>

                    <div className="col-2 col-offset-5">
                        <Button type="submit" icon="pi pi-save" tooltip="Guardar" severity="info"  />      
                    </div>
            </form>                    
        </div>                
    </div>
  )
}

export default License;
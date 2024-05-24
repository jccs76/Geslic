import Layout from "../../layout/layout";
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
import { Nullable } from "primereact/ts-helpers";

const License = () => {

    
    const emptyCustomer: App.CustomerType = {
        name: ''
    };

    const emptyProduct: App.ProductType = {
        name: ''
    };


    const emptyLicense: App.LicenseType = {
        code: '',
        purchaseDate: '',
        price: 0
    };


    const navigate = useNavigate();

    const {id} = useParams();    
    
    const dtCustomers = useRef<DataTable<any>>(null);
    const dtProducts  = useRef<DataTable<any>>(null);
    

    const [fecha, setFecha] = useState<Nullable<Date>>(null);
    const [customers, setCustomers] = useState<App.CustomerType[]>([emptyCustomer]);
    const [customersFilter, setCustomersFilter] = useState('');
    const [customer, setCustomer] = useState<any>(null);
    const [products, setProducts] = useState<App.ProductType[]>([emptyProduct]);
    const [productsFilter, setProductsFilter] = useState('');
    const [product, setProduct] = useState<any>(null);
    const [license, setLicense] = useState<any>(emptyLicense);
    
    const [isComplete, setIsComplete] = useState<boolean>(false);

    useEffect(() => {  
        CustomerService.getCustomers().then((data) => setCustomers(data as any));
        ProductService.getProducts().then((data) => setProducts(data as any));
        if (id){            
            LicenseService.getLicense(id).then((data) => {
                setLicense(data as any);
                setCustomer(data.customer);
                setProduct(data.product);
                setFecha(new Date(data.purchaseDate));});
        } else {
            setLicense(emptyLicense);
            setCustomer(null);
            setProduct(null);
            setFecha(new Date());
        }                
    }, []);

    useEffect(() => {
        (license.code && customer && product) ?
            setIsComplete(true)
        :
            setIsComplete(false);
        
    }, [license, customer, product])

    useEffect(() => {        
        let _fecha = convertDatetoISOString(fecha) ;
        setLicense((prevState: any) => (
                { ...prevState, purchaseDate : _fecha}
            ));

    }, [fecha])

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {        
        e.preventDefault();
        
        const name = e.target.name;
        const val = (e.target && e.target.value) || '';
        let _license = { ...license };
        _license[`${name}`] = val;
        setLicense(_license);

    };

    const onInputNumberChange = (e : any) => {        
        let _license = { ...license};
        _license['price'] = e.value;
        setLicense(_license);
    }


    const onProductChange = (e : any) => {
        setProduct(e.value as any);        
        let _license = { ...license};
        _license['price'] = e.value.price;
        setLicense(_license);
    }

    const handleSave = (e : any) => {
        e.preventDefault();
        console.log(license);        
        let _license = { ...license, 
            customer,
            product
           };
         if (id){
             LicenseService.updateLicense(id, _license).then((data) => setLicense(data as any))
            
         } else {
            LicenseService.createLicense(_license).then((data) => setLicense(data as any))
        }
        navigate('/licenses');
    }

    const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();        
        let _license = { ...license, 
            customer,
            product
           };
         if (id){
             LicenseService.updateLicense(id, _license).then((data) => setLicense(data as any))
            
         } else {
            LicenseService.createLicense(_license).then((data) => setLicense(data as any))
        }
        navigate(-1);
    }

    const headerCustomer = (
        <div className="flex gap-5 align-items-center">
            <h5 className="m-0">Cliente</h5>
            <IconField iconPosition="left" >
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={(e) => setCustomersFilter(e.currentTarget.value)} placeholder="Buscar..." />
            </IconField>
        </div>
    );    

    const headerProduct = (
        <div className="flex gap-5 align-items-center">
            <h5 className="m-0">Producto</h5>
            <IconField iconPosition="left" >
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={(e) => setProductsFilter(e.currentTarget.value)} placeholder="Buscar..." />
            </IconField>
        </div>
    );    

    const priceBodyTemplate = (rowData: App.ProductType) => {
        if (rowData.price){
            return formatCurrencyES(rowData?.price)
        }
        
    };

  return (
    <div className="grid">
            <div className="col-12">
                <div className="flex justify-content-start align-items-baseline">
                    <Button className="mr-2"  icon="pi pi-chevron-left" rounded text onClick={() => navigate(-1)} />                    
                    <h5>{id ? 'Editar' : 'Nueva'} Licencia</h5>
                </div>
                <div className="card p-fluid">                                        
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="code" className="">Nº Serie</label>
                            <InputText id="code" name="code"  value={license?.code} autoFocus type="text" onChange={onInputChange} />                        
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="purchaseDate" className="">Fecha Compra</label>
                            <Calendar id="purchaseDate" selectionMode="single"  locale="es-ES"  value={fecha} onChange={(e) => setFecha(e.value)} />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="price" className="">Precio</label>                
                            <InputNumber inputId="price" value={license?.price} mode="currency" currency="EUR" locale="es-ES" inputClassName="text-right" onValueChange={onInputNumberChange}/>
                        </div>
                    </div>
                    <div className="col-2 col-offset-5">
                        <Button type="button" icon="pi pi-save" disabled={!isComplete} label="Guardar" severity="info" onClick={handleSave} />                    
                    </div>
                    
                </div>
                <div className="card p-fluid">

                <DataTable
                        ref={dtCustomers}
                        value={customers}                        
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
                        globalFilter={customersFilter}                        
                        emptyMessage="No hay clientes."
                        header={headerCustomer}
                    >
                        <Column selectionMode="single" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Id"  headerStyle={{ minWidth: '3rem' }}></Column>
                        <Column field="name" header="Nombre" headerStyle={{ minWidth: '30rem' }}></Column>
                    </DataTable>
                    </div>
                    <div className="card p-fluid">
                    <DataTable
                        ref={dtProducts}
                        value={products}                        
                        selection={product}
                        onSelectionChange={onProductChange}
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
                    </div>
            </div>        
    </div>
  )
}

export default License;
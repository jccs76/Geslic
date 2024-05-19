import Layout from "../../layout/layout";
import { LicenseService } from "../../services/LicenseService";
import { App } from "@/types";
import {  useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { CustomerService } from "../../services/CustomerService";
import { ProductService } from "../../services/ProductService";


const License = () => {

    let emptyCustomer: App.Customer = {
        name: ''
    };

    let emptyProduct: App.Product = {
        name: ''
    };

    let emptyLicense: App.License = {
        code: ''
    };

    
    const navigate = useNavigate();

    const {id} = useParams();    
    
    const dtCustomers = useRef<DataTable<any>>(null);
    const dtProducts  = useRef<DataTable<any>>(null);

    const [customers, setCustomers] = useState<App.Customer[]>([emptyCustomer]);
    const [customersFilter, setCustomersFilter] = useState('');
    const [customer, setCustomer] = useState<App.Customer>(emptyCustomer);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [products, setProducts] = useState<App.Product[]>([emptyProduct]);
    const [productsFilter, setProductsFilter] = useState('');
    const [product, setProduct] = useState<App.Product>(emptyProduct);
    const [license, setLicense] = useState<App.License>(emptyLicense);    


    useEffect(() => {  
        if (id){
            LicenseService.getLicense(id).then((data) => {
                setLicense(data as App.License);
                setCustomer(license.customer as App.Customer);                                
                setProduct(license.product as App.Product);
            });
        } 
        CustomerService.getCustomers().then((data) => setCustomers(data as any));
        ProductService.getProducts().then((data) => setProducts(data as any));
       
    }, []);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {        
        e.preventDefault();

        const name = e.target.name;
        const val = (e.target && e.target.value) || '';
        let _license = { ...license };
        _license[`${name}`] = val;

        setLicense(_license);
    };


    
    const handleSave = () => {
    }

    const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let _license = { ...license, 
            customer,
            product
           };
        setLicense(_license);

        
        if (id){
            LicenseService.updateLicense(id, license).then((data) => setLicense(data as any))
            
        } else {
            LicenseService.createLicense(license).then((data) => setLicense(data as any))
        }
        navigate("/licenses");
    }

  return (
    <Layout>
    <div className="grid">
            <div className="col-12">
                <h5>{id ? 'Editar' : 'Nueva'} Licencia</h5>
                <div className="card p-fluid">
                    <form onSubmit={handleSubmit}>                                  
                    <div className="field grid">
                        <label htmlFor="name" className="">Name</label>
                        <InputText id="license.code" name="code"  value={license.code} autoFocus type="text" onChange={onInputChange} />
                    </div>
                    <div className="col-2 col-offset-5">
                        <Button type="submit" icon="pi pi-save" label="Guardar" severity="info" onClick={handleSave} />                    
                    </div>
                    </form>
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
                        header="Cliente"
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
                        onSelectionChange={(e) => setProduct(e.value as any)}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        showGridlines 
                        stripedRows
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
                        globalFilter={customersFilter}
                        emptyMessage="No hay productos."
                        header="Producto"
                    >
                        <Column selectionMode="single" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Id"  headerStyle={{ minWidth: '3rem' }}></Column>
                        <Column field="name" header="Nombre" headerStyle={{ minWidth: '30rem' }}></Column>
                    </DataTable>
                    </div>
            </div>        
    </div>
    </Layout>
  )
}

export default License;
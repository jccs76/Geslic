import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import Layout from "../../layout/layout";
import { App } from '@/types';
import { ProductService } from '../../services/ProductService';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { formatCurrencyES } from '../../util/Util';



/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Products = () => {

    let emptyProduct: App.ProductType = {
        id: '',
        name: ''
    };

    //const { products } = useContext(ProductContext);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);

    const [product, setProduct] = useState<App.ProductType>(emptyProduct);
    const [products, setProducts] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const navigate = useNavigate();
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    const {id} = useParams();    

    useEffect(() => {
        if (!id) {
            ProductService.getProducts().then((data) => setProducts(data as any));
        } else {
            ProductService.getProduct(id).then((data) => setProducts([data] as any));
        }
    }, []);

    const openNew = () => {
        navigate('/product');
    };

    const editProduct = (c: App.ProductType) => {

        navigate('/product/' + c.id );
        
    };

    const confirmDelete = (cust: App.ProductType) => {
        setProduct(cust);
        setDeleteProductDialog(true);        
    };


    const deleteProduct = () => {
        ProductService.deleteProduct(product.id)
        .then((res) =>{
             if (res?.status == 409){                
                toast.current?.show({
                    severity: 'error',
                    summary: 'Borrado',
                    detail: 'Producto no puede ser eliminado',
                    life: 3000
                });        
                hideDeleteProductDialog();
            } else {
                let _products = (products as any)?.filter((val: any) => val.id !== product.id);
                setProducts(_products);
                hideDeleteProductDialog();
                setProduct(emptyProduct);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Borrado',
                    detail: 'Producto Eliminado',
                    life: 3000
                });        
            }
        });
            
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Sí" icon="pi pi-check" text onClick={deleteProduct} />
        </>
    );

    
    const toolbarStartContent = ( 
        <div className="flex justify-content-start align-items-baseline">
            <Button className="mr-2"  icon="pi pi-chevron-left" rounded text onClick={() => navigate('/')} />                       
            <h5 className="mt-3">Gestión de Productos</h5>        
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
            <span>Productos</span>
        </div>
        
    );

    const actionBodyTemplate = (rowData: App.ProductType) => {
        return (
            <div className="flex flex-column md:flex-row md:justify-content-center md:align-items-center ">
                <Button icon="pi pi-pencil" rounded severity="success"  className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning"  onClick={() => confirmDelete(rowData)}/>
            </div>
        );
    };

    const nameBodyTemplate = (rowData: App.ProductType) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.name}
            </>
        );
    };
    const priceBodyTemplate = (rowData: App.ProductType) => {
        if (rowData.price){
            return formatCurrencyES(rowData?.price)
        }
        
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
                        value={products}                        
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value as any)}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        showGridlines 
                        stripedRows
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
                        globalFilter={globalFilter}
                        emptyMessage="No hay `productos."
                        header={header}
                    >
                        <Column field="id" header="Id"  headerStyle={{ minWidth: '3rem' }}></Column>
                        <Column field="name" header="Nombre" body={nameBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="description" header="Descripción" headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="price" header="Precio" body={priceBodyTemplate}></Column>


                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>
                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                   ¿Seguro que quiere eliminar el `producto <b>{product.name}</b>?
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

export default Products;
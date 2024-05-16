import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { useEffect, useRef, useState } from 'react';
//import { Demo } from '../../types/Demo';
import { ProductService } from '../../services/ProductService';
//import jsonData from "../../data/products.json";



/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Crud = () => {
    let emptyProduct: Product = {
        id: '',
        name: '',
        description: '',
        price: 0,
    };
    
    const [products, setProducts] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        //setProducts(jsonData as any);
        ProductService.getProducts().then((data) => setProducts(data as any));
    }, []);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR'
        });
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h3 className="m-0">Productos</h3>
            <div className="block p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-search"></i>
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Buscar..." />
                </span>

            </div>
        </div>
    );

    const actionBodyTemplate = (rowData: Product) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2"  />
                <Button icon="pi pi-trash" rounded severity="warning" />
            </>
        );
    };

    const nameBodyTemplate = (rowData: Product) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.name}
            </>
        );
    };

    const descriptionBodyTemplate = (rowData: Product) => {
        return (
            <>
                <span className="p-column-title">Descripcion</span>
                {rowData.description}
            </>
        );
    };

    const priceBodyTemplate = (rowData: Product) => {
        return (
            <>
                <span className="p-column-title">Precio</span>
                {formatCurrency(rowData.price as number)}
            </>
        );
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4"></Toolbar>

                    <DataTable
                        ref={dt}
                        value={products}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos"
                        globalFilter={globalFilter}
                        emptyMessage="No hay productos."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="name" header="Nombre" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="description" header="Descripcion" sortable body={descriptionBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="price" header="Precio" body={priceBodyTemplate}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default Crud;
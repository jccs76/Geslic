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

const Support = () => {

    
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
    

    const [fecha, setFecha] = useState<Nullable<Date>>(null);
    const [license, setLicense] = useState<any>(emptyLicense);    

    useEffect(() => {  
        if (id){            
            LicenseService.getLicense(id).then((data) => 
                setLicense(data as any))
        } else {
            setLicense(emptyLicense);
        }                
    }, []);

    useEffect(() => {
        let _fecha = convertDatetoISOString(fecha) ;

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
        _license['price'] = e.value.price;
        setLicense(_license);
    }


    const handleSave = (e : any) => {
        e.preventDefault();
        console.log(license);        
        let _license = { ...license, 
           };
         if (id){
             LicenseService.updateLicense(id, _license).then((data) => setLicense(data as any))
            
         } else {
            LicenseService.createLicense(_license).then((data) => setLicense(data as any))
        }
        navigate(-1);
    }



    const priceBodyTemplate = (rowData: App.ProductType) => {
        if (rowData.price){
            return formatCurrencyES(rowData?.price)
        }
        
    };

  return (
    <Layout>
    <div className="grid">
            <div className="col-12">
                <h5>Renovar Soporte</h5>
                <div className="card p-fluid">                                        
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-4">
                            <label htmlFor="code" className="">Nº Serie</label>
                            <InputText id="code" name="code"  value={license?.code} autoFocus type="text" onChange={onInputChange} />                        
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="fromDate" className="">Desde</label>
                            <Calendar id="lastSupport.fromDate" selectionMode="single"  locale="es-ES"  value={fecha} onChange={(e) => setFecha(e.value)} />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="toDate" className="">Hasta</label>
                            <Calendar id="lastSupport.toDate" selectionMode="single"  locale="es-ES"  value={fecha} onChange={(e) => setFecha(e.value)} />
                        </div>
                        <div className="field col-12 md:col-2">
                            <label htmlFor="lastSupport.price" className="">Precio</label>                
                            <InputNumber inputId="price" value={license?.price} mode="currency" currency="EUR" locale="es-ES" inputClassName="text-right" onValueChange={onInputNumberChange}/>
                        </div>
                    </div>
                    <div className="col-2 col-offset-5">
                        <Button type="button" icon="pi pi-save" label="Guardar" severity="info" onClick={handleSave} />                    
                    </div>
                    
                </div>
            </div>        
    </div>
    </Layout>
  )
}

export default Support;
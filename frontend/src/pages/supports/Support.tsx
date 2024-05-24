import { App } from "@/types";
import {  useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { convertDatetoISOString} from "../../util/Util";
import {Calendar} from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { SupportService } from "../..//services/SupportService";
import { SupportStatus } from "../../common/SupportStatus";
import { LicenseService } from "../../services/LicenseService";

const Support = () => {


    const navigate = useNavigate();

    const emptyLicense: App.LicenseType = {
        code: '',
        purchaseDate: '',
        price: 0
    };

    const emptySupport: App.SupportType = {
        price: 0,       
        fromDate: '',
        toDate: '',
        status: SupportStatus.ACTIVE,
        licenseId : ''    
    };

    const {id} = useParams();    
    
    const [license, setLicense] = useState<any>(emptyLicense);    
    const [support, setSupport] = useState<App.SupportType>(emptySupport);    
    
    const [frmFromDate, setFrmFromDate] = useState<Nullable<Date>>(null);
    const [frmToDate, setFrmToDate] = useState<Nullable<Date>>(null);
    const [frmPrice, setFrmPrice] = useState<Nullable<number>>(0);


    useEffect(() => {  
        if (id){            
            SupportService.getSupport(id).then((data) => {
                setSupport(data as any);
                setFrmFromDate(new Date(data.fromDate));
                setFrmToDate(new Date(data.toDate));
                setFrmPrice(data.price);
                LicenseService.getLicense(data.licenseId).then((data) => setLicense(data as any))              
        })}
    }, []);

    useEffect(() => {
        let _date = convertDatetoISOString(frmFromDate) ;
        setSupport((prevState: any) => (
            { ...prevState, fromDate : _date}
        ));
    }, [frmFromDate]);

    useEffect(() => {
        let _date = convertDatetoISOString(frmToDate) ;
        setSupport((prevState: any) => (
            { ...prevState, toDate : _date}
        ));
    }, [frmToDate]);

    useEffect(() => {
        setSupport((prevState: any) => (
            { ...prevState, price : frmPrice}
        ));
    }, [frmPrice])

 

    const handleSave = (e : any) => {
        e.preventDefault();
        console.log(support);        
        SupportService.updateSupport(id as string, support).then((data) => setSupport(data as any))
         navigate('/supports');
    }




  return (
    <div className="grid">
            <div className="col-12">
                <div className="flex justify-content-start align-items-baseline">
                    <Button className="mr-2"  icon="pi pi-chevron-left" rounded text onClick={() => navigate('/supports')} />                    
                    <h5 className="">Modificar Mantenimiento</h5>
                </div>
                <div className="card p-fluid">                                        
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-4">
                            <label htmlFor="code" className="">Nº Serie</label>
                            <InputText id="code" name="code"  value={license.code}  disabled type="text"  />                        
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="fromDate" className="">Desde</label>
                            <Calendar id="fromDate" name="fromDate" selectionMode="single"  locale="es-ES"  value={frmFromDate} onChange={(e) => setFrmFromDate(e.value)} />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="toDate" className="">Hasta</label>
                            <Calendar id="toDate" name="toDate" selectionMode="single"  locale="es-ES"  value={frmToDate} onChange={(e) => setFrmToDate(e.value)} />
                        </div>
                        <div className="field col-12 md:col-2">
                            <label htmlFor="price" className="">Precio</label>                
                            <InputNumber inputId="price" name="price" value={frmPrice} mode="currency" currency="EUR" locale="es-ES" inputClassName="text-right" onValueChange={(e) => setFrmPrice(e.value)}/>
                        </div>
                    </div>
                    <div className="col-2 col-offset-5">
                        <Button type="button" icon="pi pi-save" severity="info"  label="Guardar"  onClick={handleSave} />                    
                    </div>


                    
                </div>
            </div>        
    </div>
  )
}

export default Support;
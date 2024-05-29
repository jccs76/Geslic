import {  useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { convertDatetoISOString} from "../../util/Util";
import {Calendar} from "primereact/calendar";
import { SupportService } from "../..//services/SupportService";
import { SupportStatus } from "../../common/SupportStatus";
import { LicenseService } from "../../services/LicenseService";
import { Controller, useForm } from 'react-hook-form';
import { classNames } from "primereact/utils";


const Support = () => {

    const defaultValues : { [key: string]: any }= {
        id : '',
        fromDate : null,
        toDate : null,
        status: SupportStatus.ACTIVE,
        licenseId : ''
    };

    const navigate = useNavigate();

    const {id} = useParams();    
    
    const { control, formState: { errors }, handleSubmit, reset } = useForm({mode: "onBlur", defaultValues });

    

    useEffect(() => {  
        if (id){            
            SupportService.getSupport(id).then((dataSupport) => {                
                LicenseService.getLicense(dataSupport.licenseId).then((dataLicense) => 
                    setFormData(dataSupport, dataLicense))              
        })}
    }, []);

    const getFormErrorMessage = (name : string) => {
        return errors[name] && <small className="p-error">{errors[name]?.message as any}</small>
    };

    const setFormData = (dataSupport : any, dataLicense : any) => {        
        let formData = { id : dataSupport.id,
                    fromDate : new Date(dataSupport.fromDate),
                    toDate : new Date(dataSupport.toDate),
                    price : dataSupport.price,
                    status: dataSupport.status,
                    licenseId : dataSupport.licenseId,
                    licenseCode : dataLicense.code
        };
        reset(formData);
    }

    const getSupport = (data : any) : any => {
        const today = new Date();
        const updatedStatus = (data.Status !== SupportStatus.CANCELED && data.toDate < today) ? SupportStatus.EXPIRED : data.status;
        console.log (updatedStatus);        
        let support = {id :data.id,
                        fromDate : convertDatetoISOString(data.fromDate),
                        toDate : convertDatetoISOString(data.toDate),
                        price : data.price,
                        status: updatedStatus,
                        licenseId : data.licenseId
                    };
        return support;
    }
    

    const onSubmit = (data : any) => {
        console.log(getSupport(data));  
        SupportService.updateSupport(id as string, getSupport(data)).then((result) => {console.log(result);navigate('/supports');});
    }


  return (
    <div className="grid">
            <div className="col-12">
                <div className="flex justify-content-start align-items-baseline">
                    <Button className="mr-2"  icon="pi pi-chevron-left" rounded text onClick={() => navigate('/supports')} />                    
                    <h5 className="">Modificar Mantenimiento</h5>
                </div>
                <div className="card p-fluid">                                        
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid formgrid grid">
                    <div className="p-fluid formgrid grid">
                    
                        <div className="field col-12 md:col-4">
                            <label htmlFor="licenseCode" className="">Nº Serie</label>
                            <Controller name="licenseCode" control={control} render={({ field }) => (                             
                                <InputText id={field.name} {... field} value={field.value} disabled type="text"  />
                            )} />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="fromDate" className="">Desde</label>
                            <Controller name="fromDate" control={control} rules={{validate: {checkBefore:  (value, formValues) => value < formValues.toDate || 'Debe ser anterior a la fecha final'}, required: 'Fecha inicial obligatoria.'}}
                                    render={({ field, fieldState }) => ( 

                                <Calendar id={field.name} ref={field.ref} onBlur={field.onBlur}  
                                        value={field.value} onChange={(e) => field.onChange(e)} selectionMode="single"  locale="es-ES" mask="99/99/9999" showIcon showOnFocus={false} className={classNames({ 'p-invalid': fieldState.invalid })} />
                            // value={frmFromDate} onChange={(e) => setFrmFromDate(e.value)}
                            )} />
                            {getFormErrorMessage('fromDate')} 
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="toDate" className="">Hasta</label>
                            <Controller name="toDate" control={control} rules={{validate: {checkAfter:  (value, formValues) => value > formValues.fromDate || 'Debe ser posterior a la fecha inicial'}, required: 'Fecha final obligatoria.'}}
                                        render={({ field, fieldState }) => ( 
                                <Calendar id={field.name} ref={field.ref} onBlur={field.onBlur}  
                                value={field.value} onChange={(e) => field.onChange(e)} selectionMode="single"  locale="es-ES" mask="99/99/9999" showIcon showOnFocus={false}  className={classNames({ 'p-invalid': fieldState.invalid })} />
                            )} />
                            {getFormErrorMessage('toDate')}                                 
                        </div>
                        <div className="field col-12 md:col-2">
                            <label htmlFor="price" className="">Precio</label>
                            <Controller name="price" control={control} rules={{ required: 'Precio obligatorio.'}}
                                        render={({ field, fieldState }) => (                  
                                <InputNumber id={field.name} ref={field.ref} onBlur={field.onBlur}  
                                    value={field.value} onValueChange={(e) => field.onChange(e)} mode="currency" currency="EUR" locale="es-ES" inputClassName={classNames({ 'p-invalid': fieldState.error })} />
                             )} />
                            {getFormErrorMessage('price')}  
                        </div>
                    </div>
                    <div className="col-2 col-offset-5">
                        <Button type="submit" icon="pi pi-save" severity="info"  label="Guardar"  />                    
                    </div>
                    </form>                    
                </div>
            </div>        
    </div>
  )
}

export default Support;
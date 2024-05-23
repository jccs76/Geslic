import { App } from "@/types";
import { API_URL, authHeader } from "./Common";


export const LicenseService = {
    getLicenses() {
        return fetch(API_URL + '/licenses', { headers: authHeader() })
            .then((res) => res.json())
            .then((d) => d as any)
            .catch( (error) => console.log(error));
    },
    getLicense(id : string | undefined) {
        return fetch(`${API_URL}/licenses/${id}`, { headers: authHeader() })
            .then((res) => res.json())
            .then((d) => d as any)
            .catch( (error) => console.log(error));
    },
    createLicense(license : App.LicenseType) {
        console.log(license);
        return fetch('${API_URL}/licenses', 
            {   method: 'POST', 
                headers: authHeader(),
                body: JSON.stringify(license)
            })
            .then((res) => res.json())
            .then((d) => d as any)
            .catch( (error) => console.log(error));
    },    
    updateLicense(id: string, license : App.LicenseType) {        
        return fetch(`${API_URL}/licenses/${id}`, 
            {   method: 'PUT', 
                headers: authHeader(),
                body: JSON.stringify(license)
            })
            .then((res) => res.json())
            .then((d) => console.log(d as any))
            .catch( (error) => console.log(error));
    },    
    deleteLicense(id : string | undefined) {
        fetch(`${API_URL}/licenses/${id}`, {method: "DELETE", headers: authHeader() })
        .catch( (error) => console.log(error));
    },
    cancelSupport(id: string | undefined){
        return fetch(`${API_URL}/licenses/${id}/supports/last/cancel`, { headers: authHeader() })
            .then( (res) => res.json())
            .catch( (error) => console.log(error));
    },
    renewSupport(id: string | undefined){
        return fetch(`${API_URL}/licenses/${id}/supports/last/renew`, { headers: authHeader() })
                    .then((res) => res.json())
                    .then((d) => d as any)  
                    .catch( (error) => console.log(error));  
    },
    getLicensesSupportThisMonth() {
        return fetch(API_URL + '/licenses/thismonth', { headers: authHeader() })
            .then((res) => res.json())
            .then((d) => d as any)
            .catch( (error) => console.log(error));
    },
    getLicensesSupportBetweenDates(fromDate : string | undefined, toDate : string | undefined){
        return fetch(`${API_URL}/licenses/from/${fromDate}/to/${toDate}` , { headers: authHeader() })
            .then((res) => res.json())
            .then((d) => d as any)
            .catch( (error) => console.log(error));
    }
};
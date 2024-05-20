import { App } from "@/types";


export const LicenseService = {
    getLicenses() {
        return fetch('http://localhost:8080/api/v1/licenses', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d as any)
            .catch( (error) => console.log(error));
    },
    getLicense(id : string | undefined) {
        return fetch(`http://localhost:8080/api/v1/licenses/${id}`, { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d as any)
            .catch( (error) => console.log(error));
    },
    createLicense(license : App.LicenseType) {
        console.log(license);
        return fetch('http://localhost:8080/api/v1/licenses', 
            {   method: 'POST', 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(license)
            })
            .then((res) => res.json())
            .then((d) => d as any)
            .catch( (error) => console.log(error));
    },    
    updateLicense(id: string, license : App.LicenseType) {        
        return fetch(`http://localhost:8080/api/v1/licenses/${id}`, 
            {   method: 'PUT', 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(license)
            })
            .then((res) => res.json())
            .then((d) => console.log(d as any))
            .catch( (error) => console.log(error));
    },    
    deleteLicense(id : string | undefined) {
        fetch(`http://localhost:8080/api/v1/licenses/${id}`, {method: "DELETE", headers: { 'Cache-Control': 'no-cache' } })
        .catch( (error) => console.log(error));
    },
    cancelSupport(id: string | undefined){
        return fetch(`http://localhost:8080/api/v1/licenses/${id}/supports/last/cancel`, { headers: { 'Cache-Control': 'no-cache' } })
            .then( (res) => res.json())
            .catch( (error) => console.log(error));
    },
    renewSupport(id: string | undefined){
        return fetch(`http://localhost:8080/api/v1/licenses/${id}/supports/last/renew`, { headers: { 'Cache-Control': 'no-cache' } })
                    .then((res) => res.json())
                    .then((d) => d as any)  
                    .catch( (error) => console.log(error));  
    }
};
import { App } from "@/types";


export const LicenseService = {
    getLicenses() {
        return fetch('http://localhost:8080/api/v1/licenses', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d as App.License[])
            .catch( (error) => console.log(error));
    },
    getLicense(id : string | undefined) {
        return fetch(`http://localhost:8080/api/v1/licenses/${id}`, { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d as App.License)
            .catch( (error) => console.log(error));
    },
    createLicense(license : App.License) {
        console.log("creando");
        return fetch('http://localhost:8080/api/v1/licenses', 
            {   method: 'POST', 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(license)
            })
            .then((res) => res.json())
            .then((d) => d as App.License)
            .catch( (error) => console.log(error));
    },    
    updateLicense(id: string, license : App.License) {
        return fetch(`http://localhost:8080/api/v1/licenses/${id}`, 
            {   method: 'PUT', 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(license)
            })
            .then((res) => res.json())
            .then((d) => console.log(d as App.License))
            .catch( (error) => console.log(error));
    },    
    deleteLicense(id : string | undefined) {
        console.log(id);
        fetch(`http://localhost:8080/api/v1/licenses/${id}`, {method: "DELETE", headers: { 'Cache-Control': 'no-cache' } })
        .catch( (error) => console.log(error));
    }
};
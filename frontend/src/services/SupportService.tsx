import { App } from "@/types";


export const SupportService = {
    getSupport(id : string | undefined) {
        return fetch(`http://localhost:8080/api/v1/supports/${id}`, { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d as any)
            .catch( (error) => console.log(error));
    },    
    updateSupport(id: string, support : App.SupportType) {        
        return fetch(`http://localhost:8080/api/v1/supports/${id}`, 
            {   method: 'PUT', 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(support)
            })
            .then((res) => res.json())
            .then((d) => console.log(d as any))
            .catch( (error) => console.log(error));
    }    
};
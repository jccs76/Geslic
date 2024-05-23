import { App } from "@/types";
import { API_URL, authHeader } from "./Common";


export const SupportService = {
    getSupport(id : string | undefined) {
        return fetch(`${API_URL}/supports/${id}`, { headers: authHeader() })
            .then((res) => res.json())
            .then((d) => d as any)
            .catch( (error) => console.log(error));
    },    
    updateSupport(id: string, support : App.SupportType) {        
        return fetch(`${API_URL}/supports/${id}`, 
            {   method: 'PUT', 
                headers: authHeader(),
                body: JSON.stringify(support)
            })
            .then((res) => res.json())
            .then((d) => console.log(d as any))
            .catch( (error) => console.log(error));
    }    
};
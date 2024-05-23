import { App } from "@/types";
import { API_URL, authHeader } from "./Common";


export const CustomerService = {
    getCustomers() {
        return fetch(API_URL + '/customers', { headers: authHeader() })
            .then((res) => res.json())
            .then((d) => d as any)
            .catch( (error) => console.log(error));
    },
    getCustomer(id : string | undefined) {
        return fetch(`${API_URL}/customers/${id}`, { headers: authHeader() })
            .then((res) => res.json())
            .then((d) => d as any)
            .catch( (error) => console.log(error));
    },
    createCustomer(customer : App.CustomerType) {
        return fetch(API_URL + '/customers', 
            {   method: 'POST', 
                headers: authHeader() ,
                body: JSON.stringify(customer)
            })
            .then((res) => res.json())
            .then((d) => d as App.CustomerType)
            .catch( (error) => console.log(error));
    },    
    updateCustomer(id: string, customer : App.CustomerType) {
        return fetch(`${API_URL}/customers/${id}`, 
            {   method: 'PUT', 
                headers: authHeader(),
                body: JSON.stringify(customer)
            })
            .then((res) => res.json())
            .then((d) => console.log(d as App.CustomerType))
            .catch( (error) => console.log(error));
    },    
    deleteCustomer(id : string | undefined) {      
      return fetch(`${API_URL}/customers/${id}`, {method: "DELETE", headers: authHeader() })
        .then((d) => d as any)
        .catch( (error) => console.log(error));
    },
    getCustomerLicenses(id : string |undefined) {
        return fetch(`${API_URL}/customers/${id}/licenses`, { headers: authHeader() })
            .then((res) => res.json())
            .then((d) => d as any)
            .catch( (error) => console.log(error));
    }
};
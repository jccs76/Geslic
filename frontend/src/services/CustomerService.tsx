import { App } from "@/types";


export const CustomerService = {
    getCustomers() {
        return fetch('http://localhost:8080/api/v1/customers', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d as any)
            .catch( (error) => console.log(error));
    },
    getCustomer(id : string | undefined) {
        return fetch(`http://localhost:8080/api/v1/customers/${id}`, { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d as any)
            .catch( (error) => console.log(error));
    },
    createCustomer(customer : App.CustomerType) {
        return fetch('http://localhost:8080/api/v1/customers', 
            {   method: 'POST', 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(customer)
            })
            .then((res) => res.json())
            .then((d) => d as App.CustomerType)
            .catch( (error) => console.log(error));
    },    
    updateCustomer(id: string, customer : App.CustomerType) {
        return fetch(`http://localhost:8080/api/v1/customers/${id}`, 
            {   method: 'PUT', 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(customer)
            })
            .then((res) => res.json())
            .then((d) => console.log(d as App.CustomerType))
            .catch( (error) => console.log(error));
    },    
    deleteCustomer(id : string | undefined) {      
        fetch(`http://localhost:8080/api/v1/customers/${id}`, {method: "DELETE", headers: { 'Cache-Control': 'no-cache' } })
        .catch( (error) => console.log(error));
    },
    getCustomerLicenses(id : string |undefined) {
        return fetch(`http://localhost:8080/api/v1/customers/${id}/licenses`, { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d as any)
            .catch( (error) => console.log(error));
    }
};
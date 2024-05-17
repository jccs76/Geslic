import {App} from "@/types";

export const CustomerService = {
    getCustomers() {
        return fetch('http://localhost:8080/api/v1/customers', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d as App.Customer[]);
    },
    
    deleteCustomer(id : string | undefined) {
        return fetch(`http://localhost:8080/api/v1/customers/${id}`, {method: "DELETE", headers: { 'Cache-Control': 'no-cache' } })
        .then((res) => res.json())
        .then((d) => d as App.Customer[]);
    }
};
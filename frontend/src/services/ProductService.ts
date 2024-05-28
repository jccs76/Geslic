import { App } from "@/types";
import { API_URL, authHeader } from "./Common";


export const ProductService = {
    getProducts() {
        return fetch(API_URL + '/products', { headers: authHeader() })
            .then((res) => res.json())
            .then((d) => d as any)
            .catch( (error) => console.log(error));
    },
    getProduct(id : string | undefined) {
        return fetch(`${API_URL}/products/${id}`, { headers: authHeader() })
            .then((res) => res.json())
            .then((d) => d as any)
            .catch( (error) => console.log(error));
    },
    createProduct(product : App.ProductType) {
        return fetch(`${API_URL}/products`, 
            {   method: 'POST', 
                headers: authHeader(),
                body: JSON.stringify(product)
            })
            .catch( (error) => console.log(error));
    },    
    updateProduct(id: string, product : App.ProductType) {
        return fetch(`${API_URL}/products/${id}`, 
            {   method: 'PUT', 
                headers: authHeader(),
                body: JSON.stringify(product)
            })
            .catch( (error) => console.log(error));
    },    
    deleteProduct(id : string | undefined) {        
        return fetch(`${API_URL}/products/${id}`, {method: "DELETE", headers: authHeader() })
        .then((res) => res.json())    
        .catch( (error) => {console.log(error);});
    }
};
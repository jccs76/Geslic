import { App } from "@/types";


export const ProductService = {
    getProducts() {
        return fetch('http://localhost:8080/api/v1/products', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d as App.Product[])
            .catch( (error) => console.log(error));
    },
    getProduct(id : string | undefined) {
        return fetch(`http://localhost:8080/api/v1/products/${id}`, { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d as App.Product)
            .catch( (error) => console.log(error));
    },
    createProduct(product : App.Product) {
        console.log("creando");
        return fetch('http://localhost:8080/api/v1/products', 
            {   method: 'POST', 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(product)
            })
            .then((res) => res.json())
            .then((d) => d as App.Product)
            .catch( (error) => console.log(error));
    },    
    updateProduct(id: string, product : App.Product) {
        return fetch(`http://localhost:8080/api/v1/products/${id}`, 
            {   method: 'PUT', 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(product)
            })
            .then((res) => res.json())
            .then((d) => console.log(d as App.Product))
            .catch( (error) => console.log(error));
    },    
    deleteProduct(id : string | undefined) {
        console.log(id);
        fetch(`http://localhost:8080/api/v1/products/${id}`, {method: "DELETE", headers: { 'Cache-Control': 'no-cache' } })
        .catch( (error) => console.log(error));
    }
};
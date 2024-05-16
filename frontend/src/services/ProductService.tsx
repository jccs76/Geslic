import { Product } from "@/types";

export const ProductService = {

    getProducts() {
        return fetch('http://localhost:8080/api/v1/products', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d as Product[]);
    },

};
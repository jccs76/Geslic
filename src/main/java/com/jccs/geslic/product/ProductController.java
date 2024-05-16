package com.jccs.geslic.product;

import org.springframework.web.bind.annotation.RestController;

import com.jccs.geslic.common.AbstractController;

import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/v1/products")
class ProductController extends AbstractController<ProductDTO, ProductService> {
    
    ProductController(ProductService productService){
        super(productService);
    }
    
}

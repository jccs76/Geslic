package com.jccs.geslic.product;

import java.net.URI;
import java.util.List;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RequiredArgsConstructor

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/v1/products")
class ProductController {
    private final ProductService productService;

    @GetMapping("")    
    ResponseEntity<List<ProductDTO>> getAll() {
        return ResponseEntity.ok(productService.getAll());
    }

    @GetMapping("/{id}")    
    ResponseEntity<ProductDTO> get(@PathVariable("id") Long id) {
        return ResponseEntity.ok(productService.get(id));
    }

    
    @PostMapping("")
    ResponseEntity<ProductDTO> create(@Valid @RequestBody ProductDTO productDTO) {
        ProductDTO productCreated = productService.create(productDTO);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").
                    buildAndExpand(productCreated.id()).toUri();
        return ResponseEntity.created(location).body(productCreated);
    }

    @PutMapping("/{id}")
    ResponseEntity<ProductDTO> update(@PathVariable("id") Long id, @RequestBody ProductDTO product) {
        return ResponseEntity.ok().body(productService.update(id, product));
    }
    
    @DeleteMapping("/{id}")
    ResponseEntity<?> delete (@PathVariable("id") Long id){
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

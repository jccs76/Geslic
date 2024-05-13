package com.jccs.geslic.customer;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/v1/customers")
class CustomerController {

    private final CustomerService customerService;

    @GetMapping("")    
    ResponseEntity<List<CustomerDTO>> getAll() {
        return ResponseEntity.ok(customerService.getAll());
    }

    @GetMapping("/{id}")    
    ResponseEntity<CustomerDTO> get(@PathVariable("id") Long id) {
        return ResponseEntity.ok(customerService.get(id));
    }

    
    @PostMapping("")
    ResponseEntity<CustomerDTO> create(@Valid @RequestBody CustomerDTO customerDTO) {
        CustomerDTO customerCreated = customerService.create(customerDTO);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").
                    buildAndExpand(customerCreated.id()).toUri();
        return ResponseEntity.created(location).body(customerCreated);
    }

    @PutMapping("/{id}")
    ResponseEntity<CustomerDTO> update(@PathVariable("id") Long id, @RequestBody CustomerDTO customer) {
        return ResponseEntity.ok().body(customerService.update(id, customer));
    }
    
    @DeleteMapping("/{id}")
    ResponseEntity<?> delete (@PathVariable("id") Long id){
        customerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}


package com.jccs.geslic.customer;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jccs.geslic.common.AbstractController;
import com.jccs.geslic.license.LicenseDTO;

@RestController
@RequestMapping("/api/v1/customers")
class CustomerController extends AbstractController<CustomerDTO, CustomerService> {

    CustomerController(CustomerService customerService){
        super(customerService);
    }

    @GetMapping("/{id}/licenses")
    public ResponseEntity<List<LicenseDTO>> getLicenses(@PathVariable("id") Long id) {
        return ResponseEntity.ok(super.getService().getLicenses(id));
    }

}


package com.jccs.geslic.customer;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jccs.geslic.common.AbstractController;


@RestController
@RequestMapping("/api/v1/customers")
class CustomerController extends AbstractController<CustomerDTO, CustomerService> {

    CustomerController(CustomerService customerService){
        super(customerService);
    }

}


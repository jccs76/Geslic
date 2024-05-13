package com.jccs.geslic.customer;

import java.util.List;

interface CustomerService {
    List<CustomerDTO> getAll();
    CustomerDTO get(Long id);
    CustomerDTO create(CustomerDTO customerDTO);
    CustomerDTO update(Long id, CustomerDTO customerDTO);
    void delete(Long id);
}

package com.jccs.geslic.customer;

import java.util.List;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
interface CustomerMapper {
    CustomerDTO customerToDTO(Customer customer);
    Customer dtoToCustomer(CustomerDTO customerDTO);
    List<CustomerDTO> map(List<Customer> customer);
}

package com.jccs.geslic.customer;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jccs.geslic.common.exception.EntityExistingException;
import com.jccs.geslic.common.exception.EntityInvalidException;
import com.jccs.geslic.common.exception.EntityNotFoundException;
import com.jccs.geslic.util.Constants;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
class CustomerServiceImpl implements CustomerService{
    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;


    @Override
    public List<CustomerDTO> getAll() {
        return customerMapper.map(customerRepository.findAll());
    }

    @Override
    public CustomerDTO get(Long id) {
        return  customerMapper.customerToDTO(customerRepository.findById(id)
                                            .orElseThrow(() -> new EntityNotFoundException(Constants.PRODUCT_NOTFOUND)));
    }

    @Override
    public CustomerDTO create(CustomerDTO customerDTO) {
        customerRepository.findByName(customerDTO.name()).ifPresent ( p -> {
                                                throw new EntityExistingException (Constants.PRODUCT_EXISTS);});
        return customerMapper.customerToDTO(customerRepository.save(customerMapper.dtoToCustomer(customerDTO)));
    }
    
    @Override
    public CustomerDTO update (Long id, CustomerDTO customerDTO) {
        if (customerDTO.id().equals(id)){
            if (customerRepository.findById(id).isPresent()){            
                return customerMapper.customerToDTO(customerRepository.save(customerMapper.dtoToCustomer(customerDTO)));
            }
            throw new EntityNotFoundException(Constants.PRODUCT_NOTFOUND);
        }
        throw new EntityInvalidException(Constants.PRODUCT_INVALID);
    }

    @Override
    public void delete(Long id) {
        if (customerRepository.findById(id).isPresent()) {
            customerRepository.deleteById(id);
        }
    }

}

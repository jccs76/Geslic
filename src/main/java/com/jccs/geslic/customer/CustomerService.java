package com.jccs.geslic.customer;


import org.springframework.stereotype.Service;

import com.jccs.geslic.common.AbstractService;
import com.jccs.geslic.common.Constants;
import com.jccs.geslic.common.exception.EntityExistingException;
import com.jccs.geslic.common.exception.EntityInvalidException;
import com.jccs.geslic.common.exception.EntityNotFoundException;


@Service
public class CustomerService extends AbstractService<CustomerDTO, Customer, CustomerMapper, CustomerRepository> {

    public CustomerService(CustomerRepository repository, CustomerMapper mapper){
        super(repository, mapper);
    }

    @Override
    public CustomerDTO create(CustomerDTO dto) {
        repository.findByName(dto.name())
                              .ifPresent ( p -> {throw new EntityExistingException (Constants.ENTITY_EXISTS);});
        
        return super.create(dto);
    }
    
    @Override
    public CustomerDTO update(Long id, CustomerDTO dto) {
        if (dto.id().equals(id)){
            return super.update(id, dto);
        }
        throw new EntityInvalidException(Constants.ENTITY_INVALID);
    }

    public Customer getCustomer(Long id) {
        return repository.findById(id)
                         .orElseThrow(() -> new EntityNotFoundException(Constants.ENTITY_NOTFOUND));
    }

}

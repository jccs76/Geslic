package com.jccs.geslic.customer;


import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.jccs.geslic.common.AbstractService;
import com.jccs.geslic.common.Constants;
import com.jccs.geslic.common.exception.EntityExistingException;
import com.jccs.geslic.common.exception.EntityInvalidException;
import com.jccs.geslic.common.exception.EntityNotFoundException;
import com.jccs.geslic.license.LicenseDTO;
import com.jccs.geslic.license.LicenseMapper;

@Service
public class CustomerService extends AbstractService<CustomerDTO, Customer, CustomerMapper, CustomerRepository> {

    private  final LicenseMapper licenseMapper;

    public CustomerService(CustomerRepository repository, CustomerMapper mapper, LicenseMapper licenseMapper){
        super(repository, mapper);
        this.licenseMapper = licenseMapper;
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
             Optional<Customer> c = repository.findByName(dto.name());
             if (c.isPresent()) {
                if (!c.get().getId().equals(id)){
                    throw new EntityExistingException (Constants.ENTITY_EXISTS);                 
                }
             }   
            return super.update(id, dto);
        }
        throw new EntityInvalidException(Constants.ENTITY_INVALID);
    }

    public Customer getCustomer(Long id) {
        return repository.findById(id)
                         .orElseThrow(() -> new EntityNotFoundException(Constants.ENTITY_NOTFOUND));
    }

    public List<LicenseDTO> getLicenses(Long id){
        return licenseMapper.map(getCustomer(id).getLicenses());
    }

}

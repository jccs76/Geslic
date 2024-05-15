package com.jccs.geslic.license;

import java.util.List;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;

import com.jccs.geslic.common.AbstractService;
import com.jccs.geslic.common.Constants;
import com.jccs.geslic.common.exception.EntityExistingException;
import com.jccs.geslic.common.exception.EntityInvalidException;
import com.jccs.geslic.common.exception.EntityNotFoundException;
import com.jccs.geslic.customer.Customer;
import com.jccs.geslic.customer.CustomerService;
import com.jccs.geslic.product.Product;
import com.jccs.geslic.product.ProductService;
import com.jccs.geslic.support.Support;
import com.jccs.geslic.support.SupportDTO;
import com.jccs.geslic.support.SupportMapper;
import com.jccs.geslic.support.SupportStatus;

@Service
public class LicenseService extends AbstractService<LicenseDTO, License, LicenseMapper, LicenseRepository> {
    
    
    private final ProductService productService;
    
    private final CustomerService customerService;
    
    private  final SupportMapper supportMapper;

    public LicenseService(LicenseRepository repository, LicenseMapper mapper, 
                          ProductService productService, CustomerService customerService, SupportMapper supportMapper) {
        super(repository, mapper);
        this.productService = productService;
        this.customerService = customerService;
        this.supportMapper = supportMapper;
    }


    @Override
    public LicenseDTO create(LicenseDTO dto) {
        repository.findByCode(dto.code())
                              .ifPresent ( p -> {throw new EntityExistingException (Constants.ENTITY_EXISTS);});
        
        License license = mapper.toEntity(dto);
        Product product = productService.getProduct(dto.productId());
        license.setProduct(product);
        Customer customer = customerService.getCustomer(dto.customerId());
        license.setCustomer(customer);
        List<Support> supports = new ArrayList<>();
        Support firstSupport = new Support();
        firstSupport.setFromDate(LocalDate.ofInstant(Instant.now(), ZoneId.systemDefault()));
        firstSupport.setToDate(firstSupport.getFromDate().plusYears(1));
        firstSupport.setStatus(SupportStatus.ACTIVE);
        firstSupport.setLicense(license);        
        supports.add(firstSupport);
        license.setLastSupport(firstSupport);
        license.setSupports(supports);
        License savedlicense = repository.save(license);
        return mapper.toDTO(savedlicense);
    }
    
    @Override
    public LicenseDTO update(Long id, LicenseDTO dto) {
        if (dto.id().equals(id)){
                return super.update(id, dto);
        }
        throw new EntityInvalidException(Constants.ENTITY_INVALID);
    }

    public License getLicense(Long id){
        return repository.findById(id)
                         .orElseThrow(() -> new EntityNotFoundException(Constants.ENTITY_NOTFOUND));
    }

    public List<SupportDTO> getSupports(Long id){
        return supportMapper.map(getListSupports(id));
    }

    public SupportDTO getLastSupport(Long id) {
        return supportMapper.toDTO(getListSupports(id).getLast());
    }

    public LicenseDTO renewSupport(Long id) {
        License license = repository.findById(id)
                                    .orElseThrow(() -> new EntityNotFoundException(Constants.ENTITY_NOTFOUND));
        Support lastSupport = license.getLastSupport();
        
        Support newSupport = new Support();
        newSupport.setFromDate(lastSupport.getFromDate().plusYears(1));
        newSupport.setToDate(lastSupport.getToDate().plusYears(1));
        newSupport.setStatus(SupportStatus.ACTIVE);
        newSupport.setLicense(license);
        license.getSupports().add(newSupport);        
        license.setLastSupport(newSupport);
        License savedLicense = repository.save(license);
        return mapper.toDTO(savedLicense);
    }

    private List<Support> getListSupports(Long id){
        return getLicense(id).getSupports();
    }

}

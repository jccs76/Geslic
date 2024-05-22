package com.jccs.geslic.license;

import java.util.List;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.ArrayList;

import java.math.BigDecimal;

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
    
    private static final double PERCENTAGE  = 20;

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
        Product product = productService.getProduct(dto.product().id());
        license.setProduct(product);
        Customer customer = customerService.getCustomer(dto.customer().id());
        license.setCustomer(customer);
        List<Support> supports = new ArrayList<>();
        Support firstSupport = new Support();
        BigDecimal supportPrice = license.getPrice().multiply(BigDecimal.valueOf(PERCENTAGE/100));
        firstSupport.setPrice(supportPrice);
        //firstSupport.setFromDate(LocalDate.ofInstant(Instant.now(), ZoneId.systemDefault()));        
        firstSupport.setFromDate(license.getPurchaseDate());
        firstSupport.setToDate(license.getPurchaseDate().plusYears(1));
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

    public List<SupportDTO> getSupports(Long id){
        return supportMapper.map(getLicenseSupports(id));
    }

    public SupportDTO getLastSupport(Long id) {
        return supportMapper.toDTO(getLicenseSupports(id).getLast());
    }

    public LicenseDTO renewSupport(Long id) {
        LocalDate today = LocalDate.ofInstant(Instant.now(), ZoneId.systemDefault());
        License license = getLicense(id);
        Support lastSupport = license.getLastSupport();

        Support newSupport = new Support();
        newSupport.setPrice(lastSupport.getPrice());
        switch (lastSupport.getStatus()) {
            case SupportStatus.ACTIVE:
                    newSupport.setFromDate(lastSupport.getFromDate().plusYears(1));
                    newSupport.setToDate(lastSupport.getToDate().plusYears(1));
                    break;
            case SupportStatus.EXPIRED:
                    if(lastSupport.getToDate().plusMonths(3).isBefore(today)){
                        newSupport.setFromDate(lastSupport.getFromDate().plusYears(1));
                        newSupport.setToDate(lastSupport.getToDate().plusYears(1));
                    } else {
                        newSupport.setFromDate(today);
                        newSupport.setToDate(today.plusYears(1));    
                    }
                    break;
            case SupportStatus.CANCELED:
                    newSupport.setFromDate(today);
                    newSupport.setToDate(today.plusYears(1));
                    break;
            default:
                break;
        }
        newSupport.setStatus(SupportStatus.ACTIVE);
        newSupport.setLicense(license);
        license.getSupports().add(newSupport);        
        license.setLastSupport(newSupport);
        License savedLicense = repository.save(license);
        return mapper.toDTO(savedLicense);
    }

    public LicenseDTO cancelSupport(Long id) {
        License license = getLicense(id);
        license.getLastSupport().setStatus(SupportStatus.CANCELED);
        return mapper.toDTO(repository.save(license));
    }

    private License getLicense(Long id){
        return repository.findById(id)
                         .orElseThrow(() -> new EntityNotFoundException(Constants.ENTITY_NOTFOUND));
    }

    private List<Support> getLicenseSupports(Long id){
        return getLicense(id).getSupports();
    }

    public List<LicenseDTO> getLicensesLastSupportBetween(LocalDate dateAfter, LocalDate dateBefore){        
        return mapper.map(repository.findByLastSupportFromDateAfterToDateBefore(dateAfter, dateBefore));
    }

    public List<LicenseDTO> getLicensesLastSupportThisMonth(){
        LocalDate firstDayOfMonth = YearMonth.from(Instant.now().atZone(ZoneId.systemDefault())).atDay(1);
        LocalDate lastDayOfMonth = YearMonth.from(Instant.now().atZone(ZoneId.systemDefault())).atEndOfMonth();
        return mapper.map(repository.findByLastSupportFromDateAfterToDateBefore(firstDayOfMonth, lastDayOfMonth));
    }
}

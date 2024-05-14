package com.jccs.geslic.license;

import java.util.List;
import java.util.ArrayList;


import com.jccs.geslic.common.AbstractService;
import com.jccs.geslic.common.Constants;
import com.jccs.geslic.common.exception.EntityExistingException;
import com.jccs.geslic.common.exception.EntityInvalidException;
import com.jccs.geslic.support.Support;

public class LicenseService extends AbstractService<LicenseDTO, License, LicenseMapper, LicenseRepository> {

    
    public LicenseService(LicenseRepository repository, LicenseMapper mapper) {
        super(repository, mapper);
    }

    @Override
    public LicenseDTO create(LicenseDTO dto) {
        repository.findByCode(dto.code())
                              .ifPresent ( p -> {throw new EntityExistingException (Constants.ENTITY_EXISTS);});
        
        License license = mapper.toEntity(dto);
        List<Support> supports = new ArrayList<>();
        Support firstSupport = new Support();
        firstSupport.setLicense(license);
        supports.add(firstSupport);
        license.setSupports(supports);
        license = repository.save(license);
        return mapper.toDTO(license);
    }
    
    @Override
    public LicenseDTO update(Long id, LicenseDTO dto) {
        if (dto.id().equals(id)){
                return super.update(id, dto);
        }
        throw new EntityInvalidException(Constants.ENTITY_INVALID);
    }

}

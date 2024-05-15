package com.jccs.geslic.support;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.jccs.geslic.common.CommonMapper;
import com.jccs.geslic.license.LicenseMapper;


@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = LicenseMapper.class)
public interface SupportMapper extends CommonMapper<SupportDTO, Support> {
    @Mapping(source = "license.id", target="licenseId")    
    public SupportDTO toDTO(Support entity);
}

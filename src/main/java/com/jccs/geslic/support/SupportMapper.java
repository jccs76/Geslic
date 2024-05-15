package com.jccs.geslic.support;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.jccs.geslic.common.CommonMapper;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SupportMapper extends CommonMapper<SupportDTO, Support> {
    
    @Mapping(source = "license.id", target="licenseId")    
    public SupportDTO toDTO(Support entity);
    
    @Mapping(source = "licenseId", target="license.id")    
    public Support toEntity(SupportDTO dto);
}

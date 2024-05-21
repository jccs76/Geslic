package com.jccs.geslic.customer;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.jccs.geslic.common.CommonMapper;
import com.jccs.geslic.license.LicenseMapper;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {LicenseMapper.class})
public interface CustomerMapper extends CommonMapper<CustomerDTO, Customer>{}

package com.jccs.geslic.customer;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.jccs.geslic.common.CommonMapper;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
interface CustomerMapper extends CommonMapper<CustomerDTO, Customer>{}

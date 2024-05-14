package com.jccs.geslic.license;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.jccs.geslic.common.CommonMapper;
import com.jccs.geslic.customer.CustomerMapper;
import com.jccs.geslic.product.ProductMapper;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {ProductMapper.class, CustomerMapper.class})
public interface LicenseMapper extends CommonMapper<LicenseDTO, License> {

    @Mapping(source = "product.id", target="productId")
    @Mapping(source = "customer.id", target="customerId")
    public LicenseDTO toDTO(License entity);

}

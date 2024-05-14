package com.jccs.geslic.license;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.jccs.geslic.common.CommonMapper;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface LicenseMapper extends CommonMapper<LicenseDTO, License> {

}

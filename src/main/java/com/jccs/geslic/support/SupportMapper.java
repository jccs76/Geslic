package com.jccs.geslic.support;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.jccs.geslic.common.CommonMapper;


@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SupportMapper extends CommonMapper<SupportDTO, Support> {

}

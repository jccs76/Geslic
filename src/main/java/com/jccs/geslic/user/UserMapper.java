package com.jccs.geslic.user;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.jccs.geslic.common.CommonMapper;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper extends CommonMapper<UserDTO, User>{

}

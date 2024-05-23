package com.jccs.geslic.user;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.jccs.geslic.common.CommonMapper;
import com.jccs.geslic.common.EncodedMapping;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = UserPasswordEncoderMapper.class)
public interface UserMapper extends CommonMapper<UserDTO, User>{

    @Mapping(target = "password", qualifiedBy = EncodedMapping.class)
    public User toEntity(UserDTO dto);
        
}

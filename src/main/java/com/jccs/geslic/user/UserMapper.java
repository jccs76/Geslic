package com.jccs.geslic.user;

import org.mapstruct.Mapper;

import com.jccs.geslic.common.CommonMapper;

@Mapper(componentModel = "spring")
public interface UserMapper extends CommonMapper<UserDTO, User>{

}

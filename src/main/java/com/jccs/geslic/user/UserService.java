package com.jccs.geslic.user;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.jccs.geslic.common.AbstractService;
import com.jccs.geslic.common.Constants;
import com.jccs.geslic.common.exception.EntityExistingException;
import com.jccs.geslic.common.exception.EntityInvalidException;


@Service
public class UserService extends AbstractService<UserDTO, User, UserMapper, UserRepository>{
    
    public UserService(UserRepository repository, UserMapper mapper) {
        super(repository, mapper);
    }

    @Override
    public UserDTO create(UserDTO dto) {
        repository.findByEmail(dto.email())
                              .ifPresent ( p -> {throw new EntityExistingException (Constants.ENTITY_EXISTS);});
        
        return super.create(dto);
    }
    
    @Override
    public UserDTO update(Long id, UserDTO dto) {
        if (dto.id().equals(id)){
                return super.update(id, dto);
        }
        throw new EntityInvalidException(Constants.ENTITY_INVALID);
    }    

    public Optional<User> getByEmail(String email) {
        return repository.findByEmail(email);            
    }
}

package com.jccs.geslic.user;


import org.springframework.stereotype.Service;

import com.jccs.geslic.common.AbstractService;
import com.jccs.geslic.common.exception.EntityExistingException;
import com.jccs.geslic.common.exception.EntityInvalidException;
import com.jccs.geslic.common.exception.EntityNotFoundException;
import com.jccs.geslic.util.Constants;


@Service
class UserService extends AbstractService<UserDTO, User, UserMapper, UserRepository>{
    
    public UserService(UserRepository repository, UserMapper mapper) {
        super(repository, mapper);
    }

    @Override
    public UserDTO create(UserDTO dto) {
        repository.findByName(dto.name())
                              .ifPresent ( p -> {throw new EntityExistingException (Constants.PRODUCT_EXISTS);});
        
        return super.create(dto);
    }
    
    @Override
    public UserDTO update(Long id, UserDTO dto) {
        if (dto.id().equals(id)){
            if (repository.findById(id).isPresent()){            
                return super.update(id, dto);
            }
            throw new EntityNotFoundException(Constants.PRODUCT_NOTFOUND);
        }
        throw new EntityInvalidException(Constants.PRODUCT_INVALID);
    }
    
}

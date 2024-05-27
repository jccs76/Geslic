package com.jccs.geslic.user;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.jccs.geslic.common.AbstractService;
import com.jccs.geslic.common.Constants;
import com.jccs.geslic.common.exception.EntityExistingException;
import com.jccs.geslic.common.exception.EntityInvalidException;
import com.jccs.geslic.common.exception.EntityNotFoundException;


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
            User user = repository.findById(id).orElseThrow(() -> new EntityNotFoundException(Constants.ENTITY_NOTFOUND));
            if (user.getPassword() == dto.password()){
                UserDTO tempDTO = new UserDTO(dto.id(), dto.firstName(), dto.lastName(), dto.email(), user.getPassword(), dto.isAdmin());
                return mapper.toDTO(repository.save(mapper.toEntity(tempDTO)));         
            }                        
        }
        throw new EntityInvalidException(Constants.ENTITY_INVALID);
    }    

    public Optional<User> getByEmail(String email) {
        return repository.findByEmail(email);            
    }
}

package com.jccs.geslic.user;

import org.junit.jupiter.api.extension.ExtendWith;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.jccs.geslic.common.Constants;
import com.jccs.geslic.common.exception.EntityExistingException;
import com.jccs.geslic.common.exception.EntityNotFoundException;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    
    private UserService sut;

    private List<User> users;
    private List<UserDTO> usersDTO;

    @Mock
    private UserRepository userRepository;
    
    @Mock
    private UserMapper userMapper;

    @BeforeEach
    void setUp(){
        this.sut = new UserService(userRepository, userMapper);
        
        
        users = List.of(User.builder()
                                    .id(1L)
                                    .name("Usuario 1").build(),
                        User.builder()
                                    .id(2L)
                                    .name("Usuario 2").build());
                            
        usersDTO = List.of(
                    new UserDTO(1L,"Usuario 1"),
                    new UserDTO(2L,"Usuario 2")
        );                

    }

    @Test
    public void given_whenGetAll_thenReturnListOfUsers () {

        when(userRepository.findAll()).thenReturn(users);
        when(userMapper.map(users)).thenReturn(usersDTO);
        
        List<UserDTO> usersObtained = sut.getAll();

        assertEquals(2, usersObtained.size());
        assertEquals(users.get(0).getId(), usersObtained.get(0).id());
    }

    @Test
    public void givenUserId_whenGet_thenReturnUser () {
        Long id = 1L;
        User user = users.get(0);

        when(userRepository.findById(id)).thenReturn(Optional.of(user));
        when(userMapper.toDTO(user)).thenReturn(usersDTO.get(0));
        
        UserDTO userObtained = sut.get(id);

        assertEquals(user.getId(), userObtained.id());
    }

    @Test
    public void givenInexistentUserId_whenGet_thenThrowsNotFound () {
        Long id = -1L;
 
        doThrow(new EntityNotFoundException(Constants.ENTITY_NOTFOUND)).when(userRepository).findById(id);
 
        assertThrows(EntityNotFoundException.class, () ->sut.get(id));

    }

    @Test
    public void givenUser_whenCreated_thenCallsRepositorySave(){
        UserDTO userDTO = new UserDTO(null,"Usuario 5");
        when(userMapper.toEntity(userDTO)).thenReturn(new User());
        when(userRepository.save(any(User.class))).thenReturn(new User());

        sut.create(userDTO);

        verify(userRepository, times(1)).save(any(User.class));
        
    }

    @Test
    public void givenExistingUser_whenCreated_thenThrowUserExisting(){
        UserDTO userDTO = new UserDTO(null,"Usuario 5");
        
        doThrow(new EntityExistingException(Constants.ENTITY_EXISTS)).when(userRepository).findByName(anyString());

        assertThrows(EntityExistingException.class, () ->sut.create(userDTO));
        
        verify(userRepository, never()).save(any(User.class));        
        
    }

    @Test
    public void givenUser_whenUpdate_thenCallsRepositorySave(){
        Long id = 1L;
        User formerUser = users.get(0);
        User updatedUser = User.builder()
                                        .id(id)
                                        .name("Usuario 3")
                                        .build();
        UserDTO requestUserDTO = new UserDTO(id,"Usuario 3");
        
        when(userMapper.toEntity(requestUserDTO)).thenReturn(new User());
        when(userMapper.toDTO(updatedUser)).thenReturn(requestUserDTO);
        when(userRepository.findById(id)).thenReturn(Optional.of(formerUser));
        when(userRepository.save(any(User.class))).thenReturn(updatedUser);

        UserDTO responseUserDTO = sut.update(id, requestUserDTO);

        verify(userRepository, times(1)).save(any(User.class));
        assertEquals(id, responseUserDTO.id());
        assertNotEquals(formerUser.getName(), responseUserDTO.name());
    }

    @Test
    
    void givenInexistentUserID_whenUpdate_thenThrowUserNotFound() throws Exception {
        Long id = -1L;
        UserDTO userDTO = new UserDTO(id,"Usuario 3");
        
        doThrow(new EntityNotFoundException(Constants.ENTITY_NOTFOUND)).when(userRepository).findById(id);
       
        assertThrows(EntityNotFoundException.class, () ->sut.update(id, userDTO));
        
        verify(userRepository, never()).save(any(User.class));        

    }


    @Test
    void givenUserID_whenDelete_thenDeletedfromRepository() throws Exception {
        Long id = 1L;
        
        when(userRepository.findById(id)).thenReturn(Optional.of(users.get(0)));        
        
        sut.delete(id);
        
        verify(userRepository, times(1)).deleteById(id);

    }

    @Test

    void givenInexistentUserID_whenDelete_thenThrowUserNotFound() throws Exception {
        Long id = -1L;
         
        doThrow(new EntityNotFoundException(Constants.ENTITY_NOTFOUND)).when(userRepository).findById(id);
        
        verify(userRepository, never()).deleteById(id);
        assertThrows(EntityNotFoundException.class, () ->sut.delete(id));
    }

}


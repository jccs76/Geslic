package com.jccs.geslic.user;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jccs.geslic.common.exception.EntityExistingException;
import com.jccs.geslic.common.exception.EntityInvalidException;
import com.jccs.geslic.common.exception.EntityNotFoundException;
import com.jccs.geslic.util.Constants;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import static org.hamcrest.Matchers.*;

@WebMvcTest(controllers = UserController.class, 
            excludeAutoConfiguration =SecurityAutoConfiguration.class)
public class UserControllerTest {
    @Autowired
    private MockMvc sut;

    @MockBean
    private UserService userService;
    
    private List<UserDTO> users = new ArrayList<>();

    @BeforeEach
    void setUp() {
        users = List.of(
                    new UserDTO(1L,"Usuario1"),
                    new UserDTO(2L,"Usuario2")
        );                
    }

    @Test
    @DisplayName("Obtain a list of users")    
    void given_whenFindAll_thenReturnUserList() throws Exception {

        String jsonResponse = """
            [
                {
                    "id":1,
                    "name":"Usuario1"
                },
                {
                    "id":2,
                    "name":"Usuario2"
                }
            ]
            """;
    
        when(userService.getAll()).thenReturn(users);

        ResultActions resultActions = sut.perform(get("/api/v1/users"))
                                         .andExpect(status().isOk())
                                         .andExpect(content().contentType("application/json"))
                                         .andExpect(jsonPath("$", hasSize(2)));

        JSONAssert.assertEquals(jsonResponse, resultActions.andReturn().getResponse().getContentAsString(), false);
    }

    @Test
    @DisplayName("Given a User id obtain the user details")
    void givenUserID_whenFind_thenReturnUser() throws Exception { 
        Long id = 1L;

        String jsonResponse = """
                {
                    "id" : 1,                    
                    "name":"Usuario1"                
                }
                """;
                
        when(userService.get(id)).thenReturn(users.get(0));

        sut.perform(get("/api/v1/users/{id}", id)
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON ))
            .andExpect(content().json(jsonResponse));
    }

    
    @Test
    @DisplayName("Given a User id not existing return Not Found")
    void givenInexistentUserID_whenGet_thenReturnNotFound() throws Exception {
        Long id = -1L;

        when(userService.get(id)).thenThrow(new EntityNotFoundException(Constants.PRODUCT_NOTFOUND));

        sut.perform(get("/api/v1/users/{id}", id)
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNotFound())            
            .andExpect(content().string(Constants.PRODUCT_NOTFOUND));
    }

    @Test
    @DisplayName("Create an user and obtain the saved user")
    void givenUser_whenCreated_thenIsSaved() throws Exception {
        UserDTO user = new UserDTO(null,"Usuario 3");
        UserDTO userCreated = new UserDTO(3L,"Usuario 3");
        
        String jsonResponse = """
                {
                    "id" : 3,                    
                    "name":"Usuario 3"
                }
                """;
                
        when(userService.create(user)).thenReturn(userCreated);

        sut.perform(post("/api/v1/users")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(new ObjectMapper().writeValueAsString(user)))                                         
            .andExpect(status().isCreated())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON ))
            .andExpect(content().json(jsonResponse));
    }

    @Test
    @DisplayName("Create User without name returns invalid User error")
    void givenBadUser_whenCreate_thenReturnBadRequestError() throws Exception {
        UserDTO user = new UserDTO(null,"");

        when(userService.create(user)).thenThrow(new EntityInvalidException(Constants.PRODUCT_INVALID));

        sut.perform(post("/api/v1/users")
                    .contentType("application/json")
                    .content(new ObjectMapper().writeValueAsString(user)))                                         
            .andExpect(status().isBadRequest())            
            .andExpect(content().string(Constants.PRODUCT_INVALID));
    }

    @Test
    @DisplayName("Create User that exist returns user exist error")
    void givenUserExisting_whenCreate_thenReturnConflict() throws Exception {
        UserDTO user = users.get(0);

        when(userService.create(user)).thenThrow(new EntityExistingException(Constants.PRODUCT_EXISTS));

        sut.perform(post("/api/v1/users")
                    .contentType("application/json")
                    .content(new ObjectMapper().writeValueAsString(user)))                                         
                    .andExpect(status().isConflict())            
            .andExpect(content().string(Constants.PRODUCT_EXISTS));
    }


    @Test
    @DisplayName("Update an existing user and obtain the updated user")
    void givenUser_whenUpdated_thenIsSaved() throws Exception {
        Long id = 2L;
        UserDTO user = new UserDTO(id,"Usuario 3");

        String jsonResponse = """
                {
                    "id" : 2,                    
                    "name":"Usuario 3"
                }
                """;
                
        when(userService.update(id, user)).thenReturn(user);

        sut.perform(put("/api/v1/users/{id}", id)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(new ObjectMapper().writeValueAsString(user)))                                         
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON ))
            .andExpect(content().json(jsonResponse));
    }

    @Test
    @DisplayName("Update inexistent user returns user not found")
    void givenInexistentUserID_whenUpdate_thenReturnNotFoundError() throws Exception {
        Long id = -1L;
        UserDTO user = new UserDTO(id,"Usuario 3");

        when(userService.update(id, user)).thenThrow(new EntityNotFoundException(Constants.PRODUCT_NOTFOUND));

        sut.perform(put("/api/v1/users/{id}", id)
                    .contentType("application/json")
                    .content(new ObjectMapper().writeValueAsString(user)))                                         
            .andExpect(status().isNotFound())            
            .andExpect(content().string(Constants.PRODUCT_NOTFOUND));
    }

    @Test
    @DisplayName("Delete an existing user returns Ok")
    void givenUserID_whenDelete_thenIsDeleted() throws Exception {
        Long id = 2L;

        sut.perform(delete("/api/v1/users/{id}", id)
                    .contentType(MediaType.APPLICATION_JSON))                                         
            .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("Delete inexistent user returns user not found")
    void givenInexistentUserID_whenDelete_thenReturnNotFoundError() throws Exception {
        Long id = -1L;
    
        doThrow(new EntityNotFoundException(Constants.PRODUCT_NOTFOUND)).when(userService).delete(id);

        sut.perform(delete("/api/v1/users/{id}", id)
                    .contentType("application/json"))
            .andExpect(status().isNotFound())            
            .andExpect(content().string(Constants.PRODUCT_NOTFOUND));
    }
}

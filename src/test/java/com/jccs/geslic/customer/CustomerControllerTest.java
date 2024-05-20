package com.jccs.geslic.customer;

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
import com.jccs.geslic.common.Constants;
import com.jccs.geslic.common.exception.EntityExistingException;
import com.jccs.geslic.common.exception.EntityInvalidException;
import com.jccs.geslic.common.exception.EntityNotFoundException;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import static org.hamcrest.Matchers.*;

@WebMvcTest(controllers = CustomerController.class, 
            excludeAutoConfiguration =SecurityAutoConfiguration.class)
class CustomerControllerTest {
    
    @Autowired
    private MockMvc sut;

    @MockBean
    private CustomerService customerService;
    
    private List<CustomerDTO> customers = new ArrayList<>();

    @BeforeEach
    void setUp() {
        customers = List.of(
                    new CustomerDTO(1L,"Cliente 1","","","","","",""),
                    new CustomerDTO(2L,"Cliente 2","","","","","","")
        );                
    }

    @Test
    @DisplayName("Obtain a list of customers")    
    void given_whenFindAll_thenReturnCustomerList() throws Exception {

        String jsonResponse = """
            [
                {
                    "id":1,
                    "name":"Cliente 1"
                },
                {
                    "id":2,
                    "name":"Cliente 2"                }
            ]
            """;
    
        when(customerService.getAll()).thenReturn(customers);

        ResultActions resultActions = sut.perform(get("/api/v1/customers"))
                                         .andExpect(status().isOk())
                                         .andExpect(content().contentType("application/json"))
                                         .andExpect(jsonPath("$", hasSize(2)));

        JSONAssert.assertEquals(jsonResponse, resultActions.andReturn().getResponse().getContentAsString(), false);
    }

    @Test
    @DisplayName("Given a Customer id obtain the customer details")
    void givenCustomerID_whenFind_thenReturnCustomer() throws Exception {
        Long id = 1L;

        String jsonResponse = """
                {
                    "id" : 1,                    
                    "name":"Cliente 1"
                }
                """;
                
        when(customerService.get(id)).thenReturn(customers.get(0));

        sut.perform(get("/api/v1/customers/{id}", id)
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON ))
            .andExpect(content().json(jsonResponse));
    }

    
    @Test
    @DisplayName("Given a Customer id not existing return Not Found")
    void givenInexistentCustomerID_whenGet_thenReturnCustomerNotFound() throws Exception {
        Long id = -1L;

        when(customerService.get(id)).thenThrow(new EntityNotFoundException(Constants.ENTITY_NOTFOUND));

        sut.perform(get("/api/v1/customers/{id}", id)
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNotFound())            
            .andExpect(content().string(Constants.ENTITY_NOTFOUND));
    }

    @Test
    @DisplayName("Create a customer and obtain the saved customer")
    void givenCustomer_whenCreated_thenIsSaved() throws Exception {
        CustomerDTO customer = new CustomerDTO(null,"Cliente 3","","","","","","");
        CustomerDTO customerCreated = new CustomerDTO(3L,"Cliente 3","","","","","","");

        String jsonResponse = """
                {
                    "id" : 3,                    
                    "name":"Cliente 3"
                }
                """;
                
        when(customerService.create(customer)).thenReturn(customerCreated);

        sut.perform(post("/api/v1/customers")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(new ObjectMapper().writeValueAsString(customer)))                                         
            .andExpect(status().isCreated())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON ))
            .andExpect(content().json(jsonResponse));
    }

    @Test
    @DisplayName("Create Customer without name returns invalid customer error")
    void givenBadCustomer_whenCreate_thenReturnBadRequestError() throws Exception {
        CustomerDTO customer = new CustomerDTO(null,"Cliente 3","","","","","","");

        when(customerService.create(customer)).thenThrow(new EntityInvalidException(Constants.ENTITY_INVALID));

        sut.perform(post("/api/v1/customers")
                    .contentType("application/json")
                    .content(new ObjectMapper().writeValueAsString(customer)))                                         
            .andExpect(status().isBadRequest())            
            .andExpect(content().string(Constants.ENTITY_INVALID));
    }

    @Test
    @DisplayName("Create Customer that exist returns customer exist error")
    void givenCustomerExisting_whenCreate_thenReturnConflict() throws Exception {
        CustomerDTO customer = customers.get(0);

        when(customerService.create(customer)).thenThrow(new EntityExistingException(Constants.ENTITY_EXISTS));

        sut.perform(post("/api/v1/customers")
                    .contentType("application/json")
                    .content(new ObjectMapper().writeValueAsString(customer)))                                         
                    .andExpect(status().isConflict())            
            .andExpect(content().string(Constants.ENTITY_EXISTS));
    }


    @Test
    @DisplayName("Update an existing customer and obtain the updated customer")
    void givenCustomer_whenUpdated_thenIsSaved() throws Exception {
        Long id = 2L;
        CustomerDTO customer = new CustomerDTO(id,"Cliente 3","","","","","","");

        String jsonResponse = """
                {
                    "id" : 2,                    
                    "name":"Cliente 3"
                }
                """;
                
        when(customerService.update(id, customer)).thenReturn(customer);

        sut.perform(put("/api/v1/customers/{id}", id)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(new ObjectMapper().writeValueAsString(customer)))                                         
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON ))
            .andExpect(content().json(jsonResponse));
    }

    @Test
    @DisplayName("Update inexistent customer returns customer not found")
    void givenInexistentCustomerID_whenUpdate_thenReturnNotFoundError() throws Exception {
        Long id = -1L;
        CustomerDTO customer = new CustomerDTO(id,"Cliente 3","","","","","","");

        when(customerService.update(id, customer)).thenThrow(new EntityNotFoundException(Constants.ENTITY_NOTFOUND));

        sut.perform(put("/api/v1/customers/{id}", id)
                    .contentType("application/json")
                    .content(new ObjectMapper().writeValueAsString(customer)))                                         
            .andExpect(status().isNotFound())            
            .andExpect(content().string(Constants.ENTITY_NOTFOUND));
    }

    @Test
    @DisplayName("Delete an existing customer returns Ok")
    void givenCustomerID_whenDelete_thenIsDeleted() throws Exception {
        Long id = 2L;

        sut.perform(delete("/api/v1/customers/{id}", id)
                    .contentType(MediaType.APPLICATION_JSON))                                         
            .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("Delete inexistent customer returns customer not found")
    void givenInexistentCustomerID_whenDelete_thenReturnNotFoundError() throws Exception {
        Long id = -1L;
    
        doThrow(new EntityNotFoundException(Constants.ENTITY_NOTFOUND)).when(customerService).delete(id);

        sut.perform(delete("/api/v1/customers/{id}", id)
                    .contentType("application/json"))
            .andExpect(status().isNotFound())            
            .andExpect(content().string(Constants.ENTITY_NOTFOUND));
    }

}
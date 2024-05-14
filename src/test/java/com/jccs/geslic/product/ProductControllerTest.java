package com.jccs.geslic.product;

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

@WebMvcTest(controllers = ProductController.class, 
            excludeAutoConfiguration =SecurityAutoConfiguration.class)
class ProductControllerTest {
    
    @Autowired
    private MockMvc sut;

    @MockBean
    private ProductService productService;
    
    private List<ProductDTO> products = new ArrayList<>();

    @BeforeEach
    void setUp() {
        products = List.of(
                    new ProductDTO(1L,"RMCOBOLRT1US","Runtime RM/COBOL 1 Usuario", 120),
                    new ProductDTO(2L,"RMCOBOLRT2US","Runtime RM/COBOL 2 Usuarios", 240)
        );                
    }

    @Test
    @DisplayName("Obtain a list of products")    
    void given_whenFindAll_thenReturnProductList() throws Exception {

        String jsonResponse = """
            [
                {
                    "id":1,
                    "name":"RMCOBOLRT1US",
                    "description":"Runtime RM/COBOL 1 Usuario",
                    "price": 120 
                },
                {
                    "id":2,
                    "name":"RMCOBOLRT2US",
                    "description":"Runtime RM/COBOL 2 Usuarios",
                    "price": 240 
                }
            ]
            """;
    
        when(productService.getAll()).thenReturn(products);

        ResultActions resultActions = sut.perform(get("/api/v1/products"))
                                         .andExpect(status().isOk())
                                         .andExpect(content().contentType("application/json"))
                                         .andExpect(jsonPath("$", hasSize(2)));

        JSONAssert.assertEquals(jsonResponse, resultActions.andReturn().getResponse().getContentAsString(), false);
    }

    @Test
    @DisplayName("Given a Product id obtain the product details")
    void givenProductID_whenFind_thenReturnProduct() throws Exception {
        Long id = 1L;

        String jsonResponse = """
                {
                    "id" : 1,                    
                    "name":"RMCOBOLRT1US",
                    "description":"Runtime RM/COBOL 1 Usuario",
                    "price": 120 
                }
                """;
                
        when(productService.get(id)).thenReturn(products.get(0));

        sut.perform(get("/api/v1/products/{id}", id)
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON ))
            .andExpect(content().json(jsonResponse));
    }

    
    @Test
    @DisplayName("Given a Product id not existing return Not Found")
    void givenInexistentProductID_whenGet_thenReturnProductNotFound() throws Exception {
        Long id = -1L;

        when(productService.get(id)).thenThrow(new EntityNotFoundException(Constants.ENTITY_NOTFOUND));

        sut.perform(get("/api/v1/products/{id}", id)
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNotFound())            
            .andExpect(content().string(Constants.ENTITY_NOTFOUND));
    }

    @Test
    @DisplayName("Create a product and obtain the saved product")
    void givenProduct_whenCreated_thenIsSaved() throws Exception {
        ProductDTO product = new ProductDTO(null,"RMCOBOLRT5US","Runtime RM/COBOL 5 Usuarios", 480);
        ProductDTO productCreated = new ProductDTO(3L,"RMCOBOLRT5US","Runtime RM/COBOL 5 Usuarios", 480);

        String jsonResponse = """
                {
                    "id" : 3,                    
                    "name":"RMCOBOLRT5US",
                    "description":"Runtime RM/COBOL 5 Usuarios",
                    "price": 480 
                }
                """;
                
        when(productService.create(product)).thenReturn(productCreated);

        sut.perform(post("/api/v1/products")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(new ObjectMapper().writeValueAsString(product)))                                         
            .andExpect(status().isCreated())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON ))
            .andExpect(content().json(jsonResponse));
    }

    @Test
    @DisplayName("Create Product without name returns invalid product error")
    void givenBadProduct_whenCreate_thenReturnBadRequestError() throws Exception {
        ProductDTO product = new ProductDTO(null,"RMCOBOLRT","Runtime RM/COBOL 5 Usuarios", 480);

        when(productService.create(product)).thenThrow(new EntityInvalidException(Constants.ENTITY_INVALID));

        sut.perform(post("/api/v1/products")
                    .contentType("application/json")
                    .content(new ObjectMapper().writeValueAsString(product)))                                         
            .andExpect(status().isBadRequest())            
            .andExpect(content().string(Constants.ENTITY_INVALID));
    }

    @Test
    @DisplayName("Create Product that exist returns product exist error")
    void givenProductExisting_whenCreate_thenReturnConflict() throws Exception {
        ProductDTO product = products.get(0);

        when(productService.create(product)).thenThrow(new EntityExistingException(Constants.ENTITY_EXISTS));

        sut.perform(post("/api/v1/products")
                    .contentType("application/json")
                    .content(new ObjectMapper().writeValueAsString(product)))                                         
                    .andExpect(status().isConflict())            
            .andExpect(content().string(Constants.ENTITY_EXISTS));
    }


    @Test
    @DisplayName("Update an existing product and obtain the updated product")
    void givenProduct_whenUpdated_thenIsSaved() throws Exception {
        Long id = 2L;
        ProductDTO product = new ProductDTO(id,"RMCOBOLRT6US","Runtime RM/COBOL 6 Usuarios", 600);

        String jsonResponse = """
                {
                    "id" : 2,                    
                    "name":"RMCOBOLRT6US",
                    "description":"Runtime RM/COBOL 6 Usuarios",
                    "price": 600 
                }
                """;
                
        when(productService.update(id, product)).thenReturn(product);

        sut.perform(put("/api/v1/products/{id}", id)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(new ObjectMapper().writeValueAsString(product)))                                         
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON ))
            .andExpect(content().json(jsonResponse));
    }

    @Test
    @DisplayName("Update inexistent product returns product not found")
    void givenInexistentProductID_whenUpdate_thenReturnNotFoundError() throws Exception {
        Long id = -1L;
        ProductDTO product = new ProductDTO(id,"RMCOBOLRT6US","Runtime RM/COBOL 6 Usuarios", 600);

        when(productService.update(id, product)).thenThrow(new EntityNotFoundException(Constants.ENTITY_NOTFOUND));

        sut.perform(put("/api/v1/products/{id}", id)
                    .contentType("application/json")
                    .content(new ObjectMapper().writeValueAsString(product)))                                         
            .andExpect(status().isNotFound())            
            .andExpect(content().string(Constants.ENTITY_NOTFOUND));
    }

    @Test
    @DisplayName("Delete an existing product returns Ok")
    void givenProductID_whenDelete_thenIsDeleted() throws Exception {
        Long id = 2L;

        sut.perform(delete("/api/v1/products/{id}", id)
                    .contentType(MediaType.APPLICATION_JSON))                                         
            .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("Delete inexistent product returns product not found")
    void givenInexistentProductID_whenDelete_thenReturnNotFoundError() throws Exception {
        Long id = -1L;
    
        doThrow(new EntityNotFoundException(Constants.ENTITY_NOTFOUND)).when(productService).delete(id);

        sut.perform(delete("/api/v1/products/{id}", id)
                    .contentType("application/json"))
            .andExpect(status().isNotFound())            
            .andExpect(content().string(Constants.ENTITY_NOTFOUND));
    }

}

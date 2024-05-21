package com.jccs.geslic.support;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.math.BigDecimal;

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
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.jccs.geslic.common.Constants;
import com.jccs.geslic.common.exception.EntityExistingException;
import com.jccs.geslic.common.exception.EntityNotFoundException;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import static org.hamcrest.Matchers.*;

@WebMvcTest(controllers = SupportController.class, 
            excludeAutoConfiguration =SecurityAutoConfiguration.class)
class SupportControllerTest {
    
    @Autowired
    private MockMvc sut;

    @MockBean
    private SupportService supportService;
    
    private List<SupportDTO> supports = new ArrayList<>();

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {

        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        supports = List.of(new SupportDTO(1L, BigDecimal.valueOf(20L), LocalDate.parse("2024-01-01"), LocalDate.parse("2025-01-01"), SupportStatus.ACTIVE, 1L),
                           new SupportDTO(2L, BigDecimal.valueOf(20L), LocalDate.parse("2024-01-01"), LocalDate.parse("2025-01-01"), SupportStatus.ACTIVE, 2L));
        
    }

    @Test
    @DisplayName("Obtain a list of supports")    
    void given_whenFindAll_thenReturnSupportList() throws Exception {

        String jsonResponse = """
            [
                {
                    "id": 1,
                    "fromDate": "2024-01-01",
                    "toDate": "2025-01-01",
                    "status": "ACTIVE",
                    "licenseId": 1
            },
                {
                    "id": 2,
                    "fromDate": "2024-01-01",
                    "toDate": "2025-01-01",
                    "status": "ACTIVE",
                    "licenseId" : 2
            }
            ]
            """;
    
        when(supportService.getAll()).thenReturn(supports);

        ResultActions resultActions = sut.perform(get("/api/v1/supports"))
                                         .andExpect(status().isOk())
                                         .andExpect(content().contentType("application/json"))
                                         .andExpect(jsonPath("$", hasSize(2)));

        JSONAssert.assertEquals(jsonResponse, resultActions.andReturn().getResponse().getContentAsString(), false);
    }

    @Test
    @DisplayName("Given a Support id obtain the support details")
    void givenSupportID_whenFind_thenReturnSupport() throws Exception {
        Long id = 1L;

        String jsonResponse = """
                    {
                        "id": 1,
                        "fromDate": "2024-01-01",
                        "toDate": "2025-01-01",
                        "status": "ACTIVE",
                        "licenseId" : 1
                    }
                """;
                
        when(supportService.get(id)).thenReturn(supports.get(0));

        sut.perform(get("/api/v1/supports/{id}", id)
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON ))
            .andExpect(content().json(jsonResponse));
    }

    
    @Test
    @DisplayName("Given a Support id not existing return Not Found")
    void givenInexistentSupportID_whenGet_thenReturnSupportNotFound() throws Exception {
        Long id = -1L;

        when(supportService.get(id)).thenThrow(new EntityNotFoundException(Constants.ENTITY_NOTFOUND));

        sut.perform(get("/api/v1/supports/{id}", id)
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNotFound())            
            .andExpect(content().string(Constants.ENTITY_NOTFOUND));
    }

    @Test
    @DisplayName("Create a support and obtain the saved support")
    void givenSupport_whenCreated_thenIsSaved() throws Exception {
        SupportDTO support = new SupportDTO(null,BigDecimal.valueOf(20L),LocalDate.parse("2025-01-01"), LocalDate.parse("2026-01-01"), SupportStatus.ACTIVE, 3L);
        SupportDTO supportCreated = new SupportDTO(3L,  BigDecimal.valueOf(20L),LocalDate.parse("2025-01-01"), LocalDate.parse("2026-01-01"), SupportStatus.ACTIVE, 3L);

        String jsonResponse = """
            {
                "id": 3,
                "fromDate": "2025-01-01",
                "toDate": "2026-01-01",
                "status": "ACTIVE",
                "licenseId" : 3
            }
                """;
                
        when(supportService.create(support)).thenReturn(supportCreated);

        sut.perform(post("/api/v1/supports")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(support)))                                         
            .andExpect(status().isCreated())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON ))
            .andExpect(content().json(jsonResponse));
    }

    @Test
    @DisplayName("Create Support that exist returns support exist error")
    void givenSupportExisting_whenCreate_thenReturnConflict() throws Exception {
        SupportDTO support = supports.get(0);

        when(supportService.create(support)).thenThrow(new EntityExistingException(Constants.ENTITY_EXISTS));

        sut.perform(post("/api/v1/supports")
                    .contentType("application/json")
                    .content(objectMapper.writeValueAsString(support)))                                         
                    .andExpect(status().isConflict())            
            .andExpect(content().string(Constants.ENTITY_EXISTS));
    }


    @Test
    @DisplayName("Update an existing support and obtain the updated support")
    void givenSupport_whenUpdated_thenIsSaved() throws Exception {
        Long id = 2L;
        SupportDTO support = new SupportDTO(1L,BigDecimal.valueOf(20L),LocalDate.parse("2024-01-01"), LocalDate.parse("2025-01-01"), SupportStatus.CANCELED, 1L);

        String jsonResponse = """
            {
                "id": 1,
                "fromDate": "2024-01-01",
                "toDate": "2025-01-01",
                "status": "CANCELED",
                "licenseId" : 1
            }
            """;
                
        when(supportService.update(id, support)).thenReturn(support);

        sut.perform(put("/api/v1/supports/{id}", id)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(support)))                                         
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON ))
            .andExpect(content().json(jsonResponse));
    }

    @Test
    @DisplayName("Update inexistent support returns support not found")
    void givenInexistentSupportID_whenUpdate_thenReturnNotFoundError() throws Exception {
        Long id = -1L;
        SupportDTO support = new SupportDTO(-1L,BigDecimal.valueOf(20L), LocalDate.parse("2024-01-01"), LocalDate.parse("2025-01-01"), SupportStatus.ACTIVE, 1L);

        when(supportService.update(id, support)).thenThrow(new EntityNotFoundException(Constants.ENTITY_NOTFOUND));

        sut.perform(put("/api/v1/supports/{id}", id)
                    .contentType("application/json")
                    .content(objectMapper.writeValueAsString(support)))                                         
            .andExpect(status().isNotFound())            
            .andExpect(content().string(Constants.ENTITY_NOTFOUND));
    }

    @Test
    @DisplayName("Delete an existing support returns Ok")
    void givenSupportID_whenDelete_thenIsDeleted() throws Exception {
        Long id = 2L;

        sut.perform(delete("/api/v1/supports/{id}", id)
                    .contentType(MediaType.APPLICATION_JSON))                                         
            .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("Delete inexistent support returns support not found")
    void givenInexistentSupportID_whenDelete_thenReturnNotFoundError() throws Exception {
        Long id = -1L;
    
        doThrow(new EntityNotFoundException(Constants.ENTITY_NOTFOUND)).when(supportService).delete(id);

        sut.perform(delete("/api/v1/supports/{id}", id)
                    .contentType("application/json"))
            .andExpect(status().isNotFound())            
            .andExpect(content().string(Constants.ENTITY_NOTFOUND));
    }

}

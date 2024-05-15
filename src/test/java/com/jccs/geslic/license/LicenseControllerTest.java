package com.jccs.geslic.license;

import java.time.LocalDate;
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
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.jccs.geslic.common.Constants;
import com.jccs.geslic.common.exception.EntityExistingException;
import com.jccs.geslic.common.exception.EntityInvalidException;
import com.jccs.geslic.common.exception.EntityNotFoundException;
import com.jccs.geslic.support.SupportDTO;
import com.jccs.geslic.support.SupportStatus;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import static org.hamcrest.Matchers.*;

@WebMvcTest(controllers = LicenseController.class, 
            excludeAutoConfiguration =SecurityAutoConfiguration.class)

public class LicenseControllerTest {
    @Autowired
    private MockMvc sut;

    @MockBean
    private LicenseService licenseService;
    
    private List<LicenseDTO> licenses = new ArrayList<>();

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        List<SupportDTO> supports = List.of(new SupportDTO(1L, LocalDate.parse("2024-01-01"), LocalDate.parse("2025-01-01"), SupportStatus.ACTIVE, 1L),
                                            new SupportDTO(2L, LocalDate.parse("2024-01-01"), LocalDate.parse("2025-01-01"), SupportStatus.ACTIVE, 2L));
                 
        licenses = List.of(new LicenseDTO(1L,"6A-1000-01", 1L, 1L, supports.get(0)),
                           new LicenseDTO(2L,"6A-1000-02", 1L, 1L, supports.get(1)));

    }

    @Test
    @DisplayName("Obtain a list of licenses")    
    void given_whenFindAll_thenReturnLicenseList() throws Exception {

        String jsonResponse = """
            [
                {
                    "id":1,
                    "code":"6A-1000-01",
                    "productId": 1,
                    "customerId" : 1,
                    "lastSupport": {
                        "id": 1,
                        "fromDate": "2024-01-01",
                        "toDate": "2025-01-01",
                        "status": "ACTIVE"
                    }
                },
                {
                    "id":2,
                    "code":"6A-1000-02",
                    "productId": 1,
                    "customerId" : 1,
                    "lastSupport": {
                        "id": 2,
                        "fromDate": "2024-01-01",
                        "toDate": "2025-01-01",
                        "status": "ACTIVE"
                    }

                }
            ]
            """;
    
        when(licenseService.getAll()).thenReturn(licenses);

        ResultActions resultActions = sut.perform(get("/api/v1/licenses"))
                                         .andExpect(status().isOk())
                                         .andExpect(content().contentType("application/json"))
                                         .andExpect(jsonPath("$", hasSize(2)));

        JSONAssert.assertEquals(jsonResponse, resultActions.andReturn().getResponse().getContentAsString(), false);
    }

    @Test
    @DisplayName("Given a License id obtain the license details")
    void givenLicenseID_whenFind_thenReturnLicense() throws Exception { 
        Long id = 1L;

        String jsonResponse = """
                {
                    "id" : 1,                    
                    "code":"6A-1000-01",
                    "productId": 1,
                    "customerId" : 1,
                    "lastSupport": {
                        "id": 1,
                        "fromDate": "2024-01-01",
                        "toDate": "2025-01-01",
                        "status": "ACTIVE",
                        "licenseId": 1
                    }
                }
                """;
                
        when(licenseService.get(id)).thenReturn(licenses.get(0));

        sut.perform(get("/api/v1/licenses/{id}", id)
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON ))
            .andExpect(content().json(jsonResponse));
    }

    
    @Test
    @DisplayName("Given a License id not existing return Not Found")
    void givenInexistentLicenseID_whenGet_thenReturnNotFound() throws Exception {
        Long id = -1L;

        when(licenseService.get(id)).thenThrow(new EntityNotFoundException(Constants.ENTITY_NOTFOUND));

        sut.perform(get("/api/v1/licenses/{id}", id)
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNotFound())            
            .andExpect(content().string(Constants.ENTITY_NOTFOUND));
    }

    @Test
    @DisplayName("Create an license and obtain the saved license")
    void givenLicense_whenCreated_thenIsSaved() throws Exception {
        LicenseDTO license = new LicenseDTO(null,"6A-1000-03",1L,1L, null);        
        SupportDTO supportCreated = new SupportDTO(3L, LocalDate.parse("2024-01-01"), LocalDate.parse("2025-01-01"), SupportStatus.ACTIVE, null);
        LicenseDTO licenseCreated = new LicenseDTO(3L,"6A-1000-03",1L,1L,supportCreated);
        
        String jsonResponse = """
                {
                    "id" : 3,                    
                    "code":"6A-1000-03",
                    "lastSupport": {
                        "id": 3,
                        "fromDate": "2024-01-01",
                        "toDate": "2025-01-01",
                        "status": "ACTIVE"
                    }
                }
                """;
                
        when(licenseService.create(license)).thenReturn(licenseCreated);

        sut.perform(post("/api/v1/licenses")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(license)))                                         
            .andExpect(status().isCreated())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON ))
            .andExpect(content().json(jsonResponse));
    }

    @Test
    @DisplayName("Create License without code returns invalid License error")
    void givenBadLicense_whenCreate_thenReturnBadRequestError() throws Exception {
        LicenseDTO license = new LicenseDTO(null,"", 1L, 1L,null);

        when(licenseService.create(license)).thenThrow(new EntityInvalidException(Constants.ENTITY_INVALID));

        sut.perform(post("/api/v1/licenses")
                    .contentType("application/json")
                    .content(objectMapper.writeValueAsString(license)))                                         
            .andExpect(status().isBadRequest())            
            .andExpect(content().string(Constants.ENTITY_INVALID));
    }

    @Test
    @DisplayName("Create License that exist returns license exist error")
    void givenLicenseExisting_whenCreate_thenReturnConflict() throws Exception {
        LicenseDTO license = licenses.get(0);

        when(licenseService.create(license)).thenThrow(new EntityExistingException(Constants.ENTITY_EXISTS));

        sut.perform(post("/api/v1/licenses")
                    .contentType("application/json")
                    .content(objectMapper.writeValueAsString(license)))                                         
                    .andExpect(status().isConflict())            
                    .andExpect(content().string(Constants.ENTITY_EXISTS));
    }


    @Test
    @DisplayName("Update an existing license and obtain the updated license")
    void givenLicense_whenUpdated_thenIsSaved() throws Exception {
        Long id = 2L;
        LicenseDTO license = new LicenseDTO(id,"6A-1000-04", 1L, 1L,null);

        String jsonResponse = """
                {
                    "id" : 2,                    
                    "code":"6A-1000-04",
                    "lastSupport": {
                        "id": 2,
                        "fromDate": "2024-01-01",
                        "toDate": "2025-01-01",
                        "status": "ACTIVE",
                        "licenseId": 2
                    }                    
                }
                """;
                
        when(licenseService.update(id, license)).thenReturn(license);

        sut.perform(put("/api/v1/licenses/{id}", id)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(license)))                                         
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON ))
            .andExpect(content().json(jsonResponse));
    }

    @Test
    @DisplayName("Update inexistent license returns license not found")
    void givenInexistentLicenseID_whenUpdate_thenReturnNotFoundError() throws Exception {
        Long id = -1L;
        LicenseDTO license = new LicenseDTO(id,"6A-1000-05", 1L, 1L,null);

        when(licenseService.update(id, license)).thenThrow(new EntityNotFoundException(Constants.ENTITY_NOTFOUND));

        sut.perform(put("/api/v1/licenses/{id}", id)
                    .contentType("application/json")
                    .content(objectMapper.writeValueAsString(license)))                                         
            .andExpect(status().isNotFound())            
            .andExpect(content().string(Constants.ENTITY_NOTFOUND));
    }

    @Test
    @DisplayName("Delete an existing license returns Ok")
    void givenLicenseID_whenDelete_thenIsDeleted() throws Exception {
        Long id = 2L;

        sut.perform(delete("/api/v1/licenses/{id}", id)
                    .contentType(MediaType.APPLICATION_JSON))                                         
            .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("Delete inexistent license returns license not found")
    void givenInexistentLicenseID_whenDelete_thenReturnNotFoundError() throws Exception {
        Long id = -1L;
    
        doThrow(new EntityNotFoundException(Constants.ENTITY_NOTFOUND)).when(licenseService).delete(id);

        sut.perform(delete("/api/v1/licenses/{id}", id)
                    .contentType("application/json"))
            .andExpect(status().isNotFound())            
            .andExpect(content().string(Constants.ENTITY_NOTFOUND));
    }

}

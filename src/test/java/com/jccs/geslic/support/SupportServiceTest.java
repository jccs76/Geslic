package com.jccs.geslic.support;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.jccs.geslic.common.Constants;
import com.jccs.geslic.common.exception.EntityExistingException;
import com.jccs.geslic.common.exception.EntityNotFoundException;
import com.jccs.geslic.license.License;

@ExtendWith(MockitoExtension.class)
public class SupportServiceTest {
    
    private SupportService sut;

    private List<Support> supports;
    private List<SupportDTO> supportsDTO;


    @Mock
    private SupportRepository supportRepository;
    
    @Mock
    private SupportMapper supportMapper;

    private List<License> licenses = new ArrayList<>();

    @BeforeEach
    void setUp(){
        this.sut = new SupportService(supportRepository, supportMapper);
        
        License license = License.builder()
                                 .id(1L)
                                 .code("6A-1000-01")
                                 .product(null)
                                 .customer(null)
                                 .build();
        licenses.add(license);
        license = License.builder()
                                 .id(2L)
                                 .code("6A-1000-02")
                                 .product(null)
                                 .customer(null)
                                 .build();
        licenses.add(license);                                
        supports = List.of(Support.builder()
                                  .id(1L)
                                  .fromDate(LocalDate.parse("2024-01-01"))
                                  .toDate(LocalDate.parse("2025-01-01"))
                                  .status(SupportStatus.ACTIVE)
                                  .license(licenses.get(0))
                                  .build(),
                            Support.builder()
                            .id(2L)
                            .fromDate(LocalDate.parse("2024-01-01"))
                            .toDate(LocalDate.parse("2025-01-01"))
                            .status(SupportStatus.ACTIVE)
                            .license(licenses.get(1))
                            .build()
                    
        );                
        supportsDTO = List.of(
                            new SupportDTO(1L, LocalDate.parse("2024-01-01"), LocalDate.parse("2025-01-01"), SupportStatus.ACTIVE, 1L),
                            new SupportDTO(2L, LocalDate.parse("2024-01-01"), LocalDate.parse("2025-01-01"), SupportStatus.ACTIVE, 2L));
        

    }

    @Test
    public void given_whenGetAll_thenReturnListOfSupports () {

        when(supportRepository.findAll()).thenReturn(supports);
        when(supportMapper.map(supports)).thenReturn(supportsDTO);
        
        List<SupportDTO> supportsObtained = sut.getAll();

        assertEquals(2, supportsObtained.size());
        assertEquals(supports.get(0).getId(), supportsObtained.get(0).id());
    }

    @Test
    public void givenSupportId_whenGet_thenReturnSupport () {
        Long id = 1L;
        Support support = supports.get(0);

        when(supportRepository.findById(id)).thenReturn(Optional.of(support));
        when(supportMapper.toDTO(support)).thenReturn(supportsDTO.get(0));
        
        SupportDTO supportObtained = sut.get(id);

        assertEquals(support.getId(), supportObtained.id());
    }

    @Test
    public void givenInexistentSupportId_whenGet_thenThrowsNotFound () {
        Long id = -1L;
 
        doThrow(new EntityNotFoundException(Constants.ENTITY_NOTFOUND)).when(supportRepository).findById(id);
 
        assertThrows(EntityNotFoundException.class, () ->sut.get(id));

    }

    @Test
    public void givenSupport_whenCreated_thenCallsRepositorySave(){
        SupportDTO supportDTO = new SupportDTO(null, LocalDate.parse("2024-01-01"), LocalDate.parse("2025-01-01"), SupportStatus.ACTIVE, 1L);
        when(supportMapper.toEntity(supportDTO)).thenReturn(new Support());
        when(supportRepository.save(any(Support.class))).thenReturn(new Support());

        sut.create(supportDTO);

        verify(supportRepository, times(1)).save(any(Support.class));
        
    }

    @Test
    public void givenSupport_whenUpdate_thenCallsRepositorySave(){
        Long id = 1L;
        Support formerSupport = supports.get(0);
        Support updatedSupport = Support.builder()
                                        .id(1L)
                                        .fromDate(LocalDate.parse("2024-01-01"))
                                        .toDate(LocalDate.parse("2025-01-01"))
                                        .status(SupportStatus.CANCELED)
                                        .license(licenses.get(0))
                                        .build();
        SupportDTO requestSupportDTO = new SupportDTO(1L, LocalDate.parse("2024-01-01"), LocalDate.parse("2025-01-01"), SupportStatus.CANCELED, 1L);
        
        when(supportMapper.toEntity(requestSupportDTO)).thenReturn(new Support());
        when(supportMapper.toDTO(updatedSupport)).thenReturn(requestSupportDTO);
        when(supportRepository.findById(id)).thenReturn(Optional.of(formerSupport));
        when(supportRepository.save(any(Support.class))).thenReturn(updatedSupport);

        SupportDTO responseSupportDTO = sut.update(id, requestSupportDTO);

        verify(supportRepository, times(1)).save(any(Support.class));
        assertEquals(id, responseSupportDTO.id());
        assertNotEquals(formerSupport.getStatus(), responseSupportDTO.status());
    }

    @Test
    
    void givenInexistentSupportID_whenUpdate_thenThrowSupportNotFound() throws Exception {
        Long id = -1L;
        SupportDTO supportDTO =  new SupportDTO(id, LocalDate.parse("2024-01-01"), LocalDate.parse("2025-01-01"), SupportStatus.ACTIVE, 1L);
        
        doThrow(new EntityNotFoundException(Constants.ENTITY_NOTFOUND)).when(supportRepository).findById(id);
       
        assertThrows(EntityNotFoundException.class, () ->sut.update(id, supportDTO));
        
        verify(supportRepository, never()).save(any(Support.class));        

    }


    @Test
    void givenSupportID_whenDelete_thenDeletedfromRepository() throws Exception {
        Long id = 1L;
        
        when(supportRepository.findById(id)).thenReturn(Optional.of(supports.get(0)));        
        
        sut.delete(id);
        
        verify(supportRepository, times(1)).deleteById(id);

    }

    @Test

    void givenInexistentSupportID_whenDelete_thenThrowSupportNotFound() throws Exception {
        Long id = -1L;
         
        doThrow(new EntityNotFoundException(Constants.ENTITY_NOTFOUND)).when(supportRepository).findById(id);
        
        verify(supportRepository, never()).deleteById(id);
        assertThrows(EntityNotFoundException.class, () ->sut.delete(id));
    }

}

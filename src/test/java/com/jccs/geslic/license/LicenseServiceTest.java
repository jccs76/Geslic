package com.jccs.geslic.license;

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
public class LicenseServiceTest {
    
    private LicenseService sut;

    private List<License> licenses;
    private List<LicenseDTO> licensesDTO;

    @Mock
    private LicenseRepository licenseRepository;
    
    @Mock
    private LicenseMapper licenseMapper;

    @BeforeEach
    void setUp(){
        this.sut = new LicenseService(licenseRepository, licenseMapper);
        
        
        licenses = List.of(License.builder()
                                    .id(1L)
                                    .code("6A-1000-01").build(),
                        License.builder()
                                    .id(2L)
                                    .code("6A-1000-02").build());
                            
        licensesDTO = List.of(
                    new LicenseDTO(1L,"6A-1000-01"),
                    new LicenseDTO(2L,"6A-1000-02")
        );                

    }

    @Test
    public void given_whenGetAll_thenReturnListOfLicenses () {

        when(licenseRepository.findAll()).thenReturn(licenses);
        when(licenseMapper.map(licenses)).thenReturn(licensesDTO);
        
        List<LicenseDTO> licensesObtained = sut.getAll();

        assertEquals(2, licensesObtained.size());
        assertEquals(licenses.get(0).getId(), licensesObtained.get(0).id());
    }

    @Test
    public void givenLicenseId_whenGet_thenReturnLicense () {
        Long id = 1L;
        License license = licenses.get(0);

        when(licenseRepository.findById(id)).thenReturn(Optional.of(license));
        when(licenseMapper.toDTO(license)).thenReturn(licensesDTO.get(0));
        
        LicenseDTO licenseObtained = sut.get(id);

        assertEquals(license.getId(), licenseObtained.id());
    }

    @Test
    public void givenInexistentLicenseId_whenGet_thenThrowsNotFound () {
        Long id = -1L;
 
        doThrow(new EntityNotFoundException(Constants.ENTITY_NOTFOUND)).when(licenseRepository).findById(id);
 
        assertThrows(EntityNotFoundException.class, () ->sut.get(id));

    }

    @Test
    public void givenLicense_whenCreated_thenCallsRepositorySave(){
        LicenseDTO licenseDTO = new LicenseDTO(null,"6A-1000-03");
        when(licenseMapper.toEntity(licenseDTO)).thenReturn(new License());
        when(licenseRepository.save(any(License.class))).thenReturn(new License());

        sut.create(licenseDTO);

        verify(licenseRepository, times(1)).save(any(License.class));
        
    }

    @Test
    public void givenExistingLicense_whenCreated_thenThrowLicenseExisting(){
        LicenseDTO licenseDTO = new LicenseDTO(null,"6A-1000-01");
        
        doThrow(new EntityExistingException(Constants.ENTITY_EXISTS)).when(licenseRepository).findByCode(anyString());

        assertThrows(EntityExistingException.class, () ->sut.create(licenseDTO));
        
        verify(licenseRepository, never()).save(any(License.class));        
        
    }

    @Test
    public void givenLicense_whenUpdate_thenCallsRepositorySave(){
        Long id = 1L;
        License formerLicense = licenses.get(0);
        License updatedLicense = License.builder()
                                        .id(id)
                                        .code("6A-1000-03")
                                        .build();
        LicenseDTO requestLicenseDTO = new LicenseDTO(id,"6A-1000-03");
        
        when(licenseMapper.toEntity(requestLicenseDTO)).thenReturn(new License());
        when(licenseMapper.toDTO(updatedLicense)).thenReturn(requestLicenseDTO);
        when(licenseRepository.findById(id)).thenReturn(Optional.of(formerLicense));
        when(licenseRepository.save(any(License.class))).thenReturn(updatedLicense);

        LicenseDTO responseLicenseDTO = sut.update(id, requestLicenseDTO);

        verify(licenseRepository, times(1)).save(any(License.class));
        assertEquals(id, responseLicenseDTO.id());
        assertNotEquals(formerLicense.getCode(), responseLicenseDTO.code());
    }

    @Test
    
    void givenInexistentLicenseID_whenUpdate_thenThrowLicenseNotFound() throws Exception {
        Long id = -1L;
        LicenseDTO licenseDTO = new LicenseDTO(id,"6A-1000-05");
        
        doThrow(new EntityNotFoundException(Constants.ENTITY_NOTFOUND)).when(licenseRepository).findById(id);
       
        assertThrows(EntityNotFoundException.class, () ->sut.update(id, licenseDTO));
        
        verify(licenseRepository, never()).save(any(License.class));        

    }


    @Test
    void givenLicenseID_whenDelete_thenDeletedfromRepository() throws Exception {
        Long id = 1L;
        
        when(licenseRepository.findById(id)).thenReturn(Optional.of(licenses.get(0)));        
        
        sut.delete(id);
        
        verify(licenseRepository, times(1)).deleteById(id);

    }

    @Test

    void givenInexistentLicenseID_whenDelete_thenThrowLicenseNotFound() throws Exception {
        Long id = -1L;
         
        doThrow(new EntityNotFoundException(Constants.ENTITY_NOTFOUND)).when(licenseRepository).findById(id);
        
        verify(licenseRepository, never()).deleteById(id);
        assertThrows(EntityNotFoundException.class, () ->sut.delete(id));
    }

}


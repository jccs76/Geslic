package com.jccs.geslic.customer;

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
import com.jccs.geslic.license.LicenseMapper;

@ExtendWith(MockitoExtension.class)
public class CustomerServiceTest {
    
    private CustomerService sut;

    private List<Customer> customers;
    private List<CustomerDTO> customersDTO;

    @Mock
    private CustomerRepository customerRepository;
    
    @Mock
    private CustomerMapper customerMapper;

    @Mock
    private LicenseMapper licenseMapper;

    @BeforeEach
    void setUp(){
        this.sut = new CustomerService(customerRepository, customerMapper, licenseMapper);
        
        
        customers = List.of(Customer.builder()
                                    .id(1L)
                                    .name("Usuario 1").build(),
                        Customer.builder()
                                    .id(2L)
                                    .name("Usuario 2").build());
                            
        customersDTO = List.of(
                    new CustomerDTO(1L,"Usuario 1"),
                    new CustomerDTO(2L,"Usuario 2")
        );                

    }

    @Test
    public void given_whenGetAll_thenReturnListOfCustomers () {

        when(customerRepository.findAll()).thenReturn(customers);
        when(customerMapper.map(customers)).thenReturn(customersDTO);
        
        List<CustomerDTO> customersObtained = sut.getAll();

        assertEquals(2, customersObtained.size());
        assertEquals(customers.get(0).getId(), customersObtained.get(0).id());
    }

    @Test
    public void givenCustomerId_whenGet_thenReturnCustomer () {
        Long id = 1L;
        Customer customer = customers.get(0);

        when(customerRepository.findById(id)).thenReturn(Optional.of(customer));
        when(customerMapper.toDTO(customer)).thenReturn(customersDTO.get(0));
        
        CustomerDTO customerObtained = sut.get(id);

        assertEquals(customer.getId(), customerObtained.id());
    }

    @Test
    public void givenInexistentCustomerId_whenGet_thenThrowsNotFound () {
        Long id = -1L;
 
        doThrow(new EntityNotFoundException(Constants.ENTITY_NOTFOUND)).when(customerRepository).findById(id);
 
        assertThrows(EntityNotFoundException.class, () ->sut.get(id));

    }

    @Test
    public void givenCustomer_whenCreated_thenCallsRepositorySave(){
        CustomerDTO customerDTO = new CustomerDTO(null,"Usuario 5");
        when(customerMapper.toEntity(customerDTO)).thenReturn(new Customer());
        when(customerRepository.save(any(Customer.class))).thenReturn(new Customer());

        sut.create(customerDTO);

        verify(customerRepository, times(1)).save(any(Customer.class));
        
    }

    @Test
    public void givenExistingCustomer_whenCreated_thenThrowCustomerExisting(){
        CustomerDTO customerDTO = new CustomerDTO(null,"Usuario 5");
        
        doThrow(new EntityExistingException(Constants.ENTITY_EXISTS)).when(customerRepository).findByName(anyString());

        assertThrows(EntityExistingException.class, () ->sut.create(customerDTO));
        
        verify(customerRepository, never()).save(any(Customer.class));        
        
    }

    @Test
    public void givenCustomer_whenUpdate_thenCallsRepositorySave(){
        Long id = 1L;
        Customer formerCustomer = customers.get(0);
        Customer updatedCustomer = Customer.builder()
                                        .id(id)
                                        .name("Usuario 3")
                                        .build();
        CustomerDTO requestCustomerDTO = new CustomerDTO(id,"Usuario 3");
        
        when(customerMapper.toEntity(requestCustomerDTO)).thenReturn(new Customer());
        when(customerMapper.toDTO(updatedCustomer)).thenReturn(requestCustomerDTO);
        when(customerRepository.findById(id)).thenReturn(Optional.of(formerCustomer));
        when(customerRepository.save(any(Customer.class))).thenReturn(updatedCustomer);

        CustomerDTO responseCustomerDTO = sut.update(id, requestCustomerDTO);

        verify(customerRepository, times(1)).save(any(Customer.class));
        assertEquals(id, responseCustomerDTO.id());
        assertNotEquals(formerCustomer.getName(), responseCustomerDTO.name());
    }

    @Test
    
    void givenInexistentCustomerID_whenUpdate_thenThrowCustomerNotFound() throws Exception {
        Long id = -1L;
        CustomerDTO customerDTO = new CustomerDTO(id,"Usuario 3");
        
        doThrow(new EntityNotFoundException(Constants.ENTITY_NOTFOUND)).when(customerRepository).findById(id);
       
        assertThrows(EntityNotFoundException.class, () ->sut.update(id, customerDTO));
        
        verify(customerRepository, never()).save(any(Customer.class));        

    }


    @Test
    void givenCustomerID_whenDelete_thenDeletedfromRepository() throws Exception {
        Long id = 1L;
        
        when(customerRepository.findById(id)).thenReturn(Optional.of(customers.get(0)));        
        
        sut.delete(id);
        
        verify(customerRepository, times(1)).deleteById(id);

    }

    @Test

    void givenInexistentCustomerID_whenDelete_thenThrowCustomerNotFound() throws Exception {
        Long id = -1L;
         
        doThrow(new EntityNotFoundException(Constants.ENTITY_NOTFOUND)).when(customerRepository).findById(id);
        
        verify(customerRepository, never()).deleteById(id);
        assertThrows(EntityNotFoundException.class, () ->sut.delete(id));
    }

}



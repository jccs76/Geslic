package com.jccs.geslic.product;

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

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.jccs.geslic.common.exception.EntityExistingException;
import com.jccs.geslic.common.exception.EntityNotFoundException;
import com.jccs.geslic.util.Constants;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {
    
    private ProductService sut;

    private List<Product> products;
    private List<ProductDTO> productsDTO;

    @Mock
    private ProductRepository productRepository;
    
    @Mock
    private ProductMapper productMapper;

    @BeforeEach
    void setUp(){
        this.sut = new ProductServiceImpl(productRepository, productMapper);
        products = List.of(
                    new Product(1L,"RMCOBOLRT1US","Runtime RM/COBOL 1 Usuario", BigDecimal.valueOf(120L)),
                    new Product(2L,"RMCOBOLRT2US","Runtime RM/COBOL 2 Usuarios", BigDecimal.valueOf(240L))
        );                
        productsDTO = List.of(
                    new ProductDTO(1L,"RMCOBOLRT1US","Runtime RM/COBOL 1 Usuario", 120L),
                    new ProductDTO(2L,"RMCOBOLRT2US","Runtime RM/COBOL 2 Usuarios",240L)
        );                

    }

    @Test
    public void given_whenGetAll_thenReturnListOfProducts () {

        when(productRepository.findAll()).thenReturn(products);
        when(productMapper.map(products)).thenReturn(productsDTO);
        
        List<ProductDTO> productsObtained = sut.getAll();

        assertEquals(2, productsObtained.size());
        assertEquals(products.get(0).id, productsObtained.get(0).id());
    }

    @Test
    public void givenProductId_whenGet_thenReturnProduct () {
        Long id = 1L;
        Product product = products.get(0);

        when(productRepository.findById(id)).thenReturn(Optional.of(product));
        when(productMapper.toDTO(product)).thenReturn(productsDTO.get(0));
        
        ProductDTO productObtained = sut.get(id);

        assertEquals(product.id, productObtained.id());
    }

    @Test
    public void givenInexistentProductId_whenGet_thenThrowsNotFound () {
        Long id = -1L;
 
        doThrow(new EntityNotFoundException(Constants.PRODUCT_NOTFOUND)).when(productRepository).findById(id);
 
        assertThrows(EntityNotFoundException.class, () ->sut.get(id));

    }

    @Test
    public void givenProduct_whenCreated_thenCallsRepositorySave(){
        ProductDTO productDTO = new ProductDTO(null,"RMCOBOLRT5US","Runtime RM/COBOL 5 Usuarios", 480);
        when(productMapper.toEntity(productDTO)).thenReturn(new Product());
        when(productRepository.save(any(Product.class))).thenReturn(new Product());

        sut.create(productDTO);

        verify(productRepository, times(1)).save(any(Product.class));
        
    }

    @Test
    public void givenExistingProduct_whenCreated_thenThrowProductExisting(){
        ProductDTO productDTO = new ProductDTO(null,"RMCOBOLRT1US","", 0);
        
        doThrow(new EntityExistingException(Constants.PRODUCT_EXISTS)).when(productRepository).findByName(anyString());

        assertThrows(EntityExistingException.class, () ->sut.create(productDTO));
        
        verify(productRepository, never()).save(any(Product.class));        
        
    }

    @Test
    public void givenProduct_whenUpdate_thenCallsRepositorySave(){
        Long id = 1L;
        Product formerProduct = products.get(0);
        Product updatedProduct = new Product (id, "RMCOBOLRT10US","Runtime RM/COBOL 10 Usuarios", BigDecimal.valueOf(1200));
        ProductDTO requestProductDTO = new ProductDTO(id,"RMCOBOLRT10US","Runtime RM/COBOL 10 Usuarios", 1200);
        
        when(productMapper.toEntity(requestProductDTO)).thenReturn(new Product());
        when(productMapper.toDTO(updatedProduct)).thenReturn(requestProductDTO);
        when(productRepository.findById(id)).thenReturn(Optional.of(formerProduct));
        when(productRepository.save(any(Product.class))).thenReturn(updatedProduct);

        ProductDTO responseProductDTO = sut.update(id, requestProductDTO);

        verify(productRepository, times(1)).save(any(Product.class));
        assertEquals(id, responseProductDTO.id());
        assertNotEquals(formerProduct.name, responseProductDTO.name());
    }

    @Test
    
    void givenInexistentProductID_whenUpdate_thenThrowProductNotFound() throws Exception {
        Long id = -1L;
        ProductDTO productDTO = new ProductDTO(id,"RMCOBOLRT6US","Runtime RM/COBOL 6 Usuarios", 600);
        
        doThrow(new EntityNotFoundException(Constants.PRODUCT_NOTFOUND)).when(productRepository).findById(id);
       
        assertThrows(EntityNotFoundException.class, () ->sut.update(id, productDTO));
        
        verify(productRepository, never()).save(any(Product.class));        

    }


    @Test
    void givenProductID_whenDelete_thenDeletedfromRepository() throws Exception {
        Long id = 1L;
        
        when(productRepository.findById(id)).thenReturn(Optional.of(products.get(0)));        
        
        sut.delete(id);
        
        verify(productRepository, times(1)).deleteById(id);

    }

    @Test

    void givenInexistentProductID_whenDelete_thenThrowProductNotFound() throws Exception {
        Long id = -1L;
         
        doThrow(new EntityNotFoundException(Constants.PRODUCT_NOTFOUND)).when(productRepository).findById(id);
        
        verify(productRepository, never()).deleteById(id);
        assertThrows(EntityNotFoundException.class, () ->sut.delete(id));
    }

}

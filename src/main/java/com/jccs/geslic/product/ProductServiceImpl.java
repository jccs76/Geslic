package com.jccs.geslic.product;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jccs.geslic.common.exception.EntityExistingException;
import com.jccs.geslic.common.exception.EntityInvalidException;
import com.jccs.geslic.common.exception.EntityNotFoundException;
import com.jccs.geslic.util.Constants;

import lombok.RequiredArgsConstructor;


@RequiredArgsConstructor
@Service
class ProductServiceImpl implements ProductService {
    
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;


    @Override
    public List<ProductDTO> getAll() {
        return productMapper.map(productRepository.findAll());
    }

    @Override
    public ProductDTO get(Long id) {
        return  productMapper.toDTO(productRepository.findById(id)
                                            .orElseThrow(() -> new EntityNotFoundException(Constants.PRODUCT_NOTFOUND)));
    }

    @Override
    public ProductDTO create(ProductDTO productDTO) {
        productRepository.findByName(productDTO.name()).ifPresent ( p -> {
                                                throw new EntityExistingException (Constants.PRODUCT_EXISTS);});
        return productMapper.toDTO(productRepository.save(productMapper.toEntity(productDTO)));
    }
    
    @Override
    public ProductDTO update (Long id, ProductDTO productDTO) {
        if (productDTO.id().equals(id)){
            if (productRepository.findById(id).isPresent()){            
                return productMapper.toDTO(productRepository.save(productMapper.toEntity(productDTO)));
            }
            throw new EntityNotFoundException(Constants.PRODUCT_NOTFOUND);
        }
        throw new EntityInvalidException(Constants.PRODUCT_INVALID);
    }

    @Override
    public void delete(Long id) {
        if (productRepository.findById(id).isPresent()) {
            productRepository.deleteById(id);
        }
    }


}

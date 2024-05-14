package com.jccs.geslic.product;

import org.springframework.stereotype.Service;

import com.jccs.geslic.common.AbstractService;
import com.jccs.geslic.common.Constants;
import com.jccs.geslic.common.exception.EntityExistingException;
import com.jccs.geslic.common.exception.EntityInvalidException;

@Service
class ProductService extends AbstractService<ProductDTO, Product, ProductMapper, ProductRepository>{
   
    public ProductService(ProductRepository repository, ProductMapper mapper) {
        super(repository, mapper);
    }

    @Override
    public ProductDTO create(ProductDTO dto) {
        repository.findByName(dto.name())
                              .ifPresent ( p -> {throw new EntityExistingException (Constants.ENTITY_EXISTS);});
        
        return super.create(dto);
    }
    
    @Override
    public ProductDTO update(Long id, ProductDTO dto) {
        if (dto.id().equals(id)){
            return super.update(id, dto);
        }
        throw new EntityInvalidException(Constants.ENTITY_INVALID);
    }

}
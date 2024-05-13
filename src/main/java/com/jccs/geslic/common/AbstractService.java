package com.jccs.geslic.common;

import java.util.List;

import com.jccs.geslic.common.exception.EntityNotFoundException;
import com.jccs.geslic.util.Constants;

public abstract class AbstractService<D extends Record, E extends AbstractEntity, M extends CommonMapper<D, E>, R extends CommonRepository<E>> implements CommonService<D> {

    protected final R repository;
    protected final M mapper;
 
    public AbstractService(R repository, M mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public List<D> getAll() {
        return mapper.map(repository.findAll());    
    }

    @Override
    public D get(Long id) {
        return  mapper.toDTO(repository.findById(id)
                                            .orElseThrow(() -> new EntityNotFoundException(Constants.PRODUCT_NOTFOUND)));
    }

    @Override
    public D create(D dto) {
        return mapper.toDTO(repository.save(mapper.toEntity(dto)));    
    }


    @Override
    public D update(Long id, D dto) {
        return mapper.toDTO(repository.save(mapper.toEntity(dto)));
    }

    @Override
    public void delete(Long id) {
        if (repository.findById(id).isPresent()) {
            repository.deleteById(id);
        }
    }


}

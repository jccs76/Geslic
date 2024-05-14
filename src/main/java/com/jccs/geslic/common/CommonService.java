package com.jccs.geslic.common;

import java.util.List;

public interface CommonService<D extends Record> {
    List<D> getAll();        
    D get(Long id);    
    D create(D dto);
    D update(Long id, D dto);
    void delete(Long id);    
}
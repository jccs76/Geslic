package com.jccs.geslic.common;

import java.util.List;


public abstract interface CommonMapper<D, E> {
    D toDTO(E entity);
    E toEntity(D dto);
    List<D> map(List<E> entity);
}

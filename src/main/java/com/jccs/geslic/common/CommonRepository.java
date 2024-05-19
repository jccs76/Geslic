package com.jccs.geslic.common;

import java.util.List;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.jpa.repository.JpaRepository;

@NoRepositoryBean
public interface CommonRepository <E extends AbstractEntity> extends JpaRepository<E, Long> {
    public List<E> findAllByOrderByIdAsc();
} 

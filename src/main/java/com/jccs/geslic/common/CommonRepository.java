package com.jccs.geslic.common;

import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.jpa.repository.JpaRepository;

@NoRepositoryBean
public interface CommonRepository <E extends AbstractEntity> extends JpaRepository<E, Long> {} 

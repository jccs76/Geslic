package com.jccs.geslic.support;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jccs.geslic.common.CommonRepository;

import jakarta.transaction.Transactional;

@Repository
public interface SupportRepository  extends CommonRepository<Support>{
    
    @Transactional
    @Query("update Support set status = 'EXPIRED' where status = 'ACTIVE' and toDate < :today")
    @Modifying
    void updateSupportStatusWhenExpires(LocalDate today);
    
}

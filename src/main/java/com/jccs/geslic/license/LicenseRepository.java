package com.jccs.geslic.license;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jccs.geslic.common.CommonRepository;
import java.util.Optional;
import java.util.List;
import java.time.LocalDate;


@Repository
interface LicenseRepository extends CommonRepository<License>{
    Optional<License> findByCode(String code);
  
    @Query("select l from License l where lastSupport.toDate >= ?1 and lastSupport.toDate <= ?2")
    List<License> findByLastSupportFromDateAfterToDateBefore(LocalDate dateAfter, LocalDate dateBefore);

}

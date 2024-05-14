package com.jccs.geslic.license;

import org.springframework.stereotype.Repository;

import com.jccs.geslic.common.CommonRepository;
import java.util.Optional;


@Repository
interface LicenseRepository extends CommonRepository<License>{
    Optional<License> findByCode(String code);
}

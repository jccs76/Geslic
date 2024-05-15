package com.jccs.geslic.license;

import com.jccs.geslic.support.SupportDTO;

public record LicenseDTO(Long id, 
                         String code,                         
                         Long productId,
                         Long customerId,
                         SupportDTO lastSupport
                         ) {}

package com.jccs.geslic.license;

public record LicenseDTO(Long id, 
                         String code,                         
                         Long productId,
                         Long customerId
                         ) {}

package com.jccs.geslic.license;

import com.jccs.geslic.customer.CustomerDTO;
import com.jccs.geslic.product.ProductDTO;
import com.jccs.geslic.support.SupportDTO;

public record LicenseDTO(Long id, 
                         String code,                         
                         ProductDTO product,
                         CustomerDTO customer,
                         SupportDTO lastSupport
                         ) {}

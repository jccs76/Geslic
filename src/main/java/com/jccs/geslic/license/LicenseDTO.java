package com.jccs.geslic.license;

import java.time.LocalDate;
import java.math.BigDecimal;

import com.jccs.geslic.customer.CustomerDTO;
import com.jccs.geslic.product.ProductDTO;
import com.jccs.geslic.support.SupportDTO;

public record LicenseDTO(Long id, 
                         String code,
                         LocalDate purchaseDate,
                         BigDecimal price,
                         ProductDTO product,
                         CustomerDTO customer,
                         SupportDTO lastSupport
                         ) {}

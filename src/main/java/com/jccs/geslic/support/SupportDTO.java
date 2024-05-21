package com.jccs.geslic.support;

import java.time.LocalDate;
import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonFormat;

public record SupportDTO(Long id,
                         BigDecimal price,
                         @JsonFormat(pattern="yyyy-MM-dd") 
                         LocalDate fromDate,
                         @JsonFormat(pattern="yyyy-MM-dd") 
                         LocalDate toDate,
                         SupportStatus status,                        
                         Long licenseId) {}

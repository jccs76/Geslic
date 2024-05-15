package com.jccs.geslic.support;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

public record SupportDTO(Long id,
                         @JsonFormat(pattern="yyyy-MM-dd") 
                         LocalDate fromDate,
                         @JsonFormat(pattern="yyyy-MM-dd") 
                         LocalDate toDate,
                         SupportStatus status,                        
                         Long licenseId) {}

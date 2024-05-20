package com.jccs.geslic.customer;

import jakarta.validation.constraints.NotBlank;

public record CustomerDTO(Long id,
                   @NotBlank String name,
                   String address,
                   String zipCode,
                   String province,
                   String city,
                   String phoneNumber,
                   String email) {}
                    
package com.jccs.geslic.customer;

import jakarta.validation.constraints.NotBlank;

record CustomerDTO(Long id,
                    @NotBlank String name) {}
                    
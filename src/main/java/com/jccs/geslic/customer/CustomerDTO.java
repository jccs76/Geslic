package com.jccs.geslic.customer;

import jakarta.validation.constraints.NotBlank;

public record CustomerDTO(Long id,
                   @NotBlank String name) {}
                    
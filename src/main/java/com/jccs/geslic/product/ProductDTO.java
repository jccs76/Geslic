package com.jccs.geslic.product;

import jakarta.validation.constraints.NotBlank;

public record ProductDTO(Long id, 
                @NotBlank 
                String name, 
                String description, 
                float price) { } 
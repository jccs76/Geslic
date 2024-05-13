package com.jccs.geslic.product;

import jakarta.validation.constraints.NotBlank;

record ProductDTO(Long id, 
                @NotBlank 
                String name, 
                String description, 
                float price) { } 
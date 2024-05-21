package com.jccs.geslic.customer;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.jccs.geslic.license.License;

import jakarta.validation.constraints.NotBlank;

public record CustomerDTO(Long id,
                   @NotBlank String name,
                   String address,
                   String zipCode,
                   String state,
                   String city,
                   String phoneNumber,
                   String email,
                   @JsonIgnore
                   List<License> licenses) {}
                    
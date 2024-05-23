package com.jccs.geslic.user;

public record UserDTO(Long id,
                      String firstName,
                      String lastName,
                      String email,
                      String password) {}

package com.jccs.geslic.user;

public record UserLoginDTO(Long id, 
                           String email,
                           String password) {}

package com.jccs.geslic.auth;


public record LoginResponse (String token,                            
                            Long expiresIn){}
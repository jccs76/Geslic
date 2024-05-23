package com.jccs.geslic.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import com.jccs.geslic.user.User;
import com.jccs.geslic.user.UserDTO;
import com.jccs.geslic.user.UserLoginDTO;
import com.jccs.geslic.user.UserService;

@Service
public class AuthenticationService {
    private final UserService userService;    
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(UserService userService,
                                 AuthenticationManager authenticationManager){

        this.authenticationManager = authenticationManager;
        this.userService = userService;
    }

    public UserDTO signup(UserDTO userDTO) {
        return userService.create(userDTO);
    }

    public User authenticate(UserLoginDTO userLogin) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userLogin.email(),
                        userLogin.password()
                )
        );

        return userService.getByEmail(userLogin.email())
                          .orElseThrow();                
    }
}
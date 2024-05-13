package com.jccs.geslic.user;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jccs.geslic.common.AbstractController;

@RestController
@RequestMapping("/api/v1/users")
class UserController extends AbstractController<UserDTO, UserService>{
    public UserController(UserService service) {        
        super(service);
    }
    
}

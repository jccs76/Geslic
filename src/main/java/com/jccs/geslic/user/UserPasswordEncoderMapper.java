package com.jccs.geslic.user;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.jccs.geslic.common.EncodedMapping;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;


@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserPasswordEncoderMapper {
    final PasswordEncoder passwordEncoder;
    
    @EncodedMapping
    public String encode(String value) {
        return passwordEncoder.encode(value);
    }
}

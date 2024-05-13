package com.jccs.geslic.user;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.jccs.geslic.common.CommonRepository;

@Repository
interface UserRepository extends CommonRepository<User> {
    Optional<User> findByName (String name);
}

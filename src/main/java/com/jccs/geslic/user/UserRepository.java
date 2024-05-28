package com.jccs.geslic.user;

import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jccs.geslic.common.CommonRepository;

import jakarta.transaction.Transactional;

@Repository
public interface UserRepository extends CommonRepository<User> {
    Optional<User> findByEmail (String email);

    @Transactional
    @Query(value = "update users set first_name = :firstName , last_name = :lastName , is_admin = :isAdmin where id = :id" ,nativeQuery = true)
    @Modifying
    void updateUserAvoidingPassword(Long id,
                                    String firstName,
                                    String lastName,
                                    Boolean isAdmin
                                    );

}

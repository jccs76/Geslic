package com.jccs.geslic.customer;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.jccs.geslic.common.CommonRepository;

@Repository
interface CustomerRepository extends CommonRepository<Customer> {
    Optional<Customer> findByName(String name);
}

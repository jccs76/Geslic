package com.jccs.geslic.product;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.jccs.geslic.common.CommonRepository;

@Repository
interface ProductRepository extends CommonRepository<Product>  {
    Optional<Product> findByName (String name);

}

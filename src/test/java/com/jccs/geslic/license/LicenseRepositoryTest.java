package com.jccs.geslic.license;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.jccs.geslic.customer.Customer;
import com.jccs.geslic.product.Product;
import com.jccs.geslic.support.Support;
import com.jccs.geslic.support.SupportStatus;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.ArrayList;
import java.time.LocalDate;
import java.math.BigDecimal;


@DataJpaTest
public class LicenseRepositoryTest {
    @Autowired
    private LicenseRepository repository;

    private Product  product;
    private Customer customer;
    private List<License> licenses;
    private List<Support> supports;

        
    @BeforeEach
    public void setUp() {
        product = Product.builder().id(1L).name("RMCOBOLRT1US").description("Runtime RM/COBOL 1 Usuario").price(BigDecimal.valueOf(120)).build();
        customer = Customer.builder().id(1L).name("Cliente 1").build();
        

        licenses = List.of(License.builder()
                                    .id(1L)
                                    .code("6A-1000-01")
                                    .purchaseDate(LocalDate.parse("2023-05-01"))
                                    .price(BigDecimal.valueOf(120L))
                                    .product(product)
                                    .customer(customer)
                                    .build(),
                        License.builder()
                                    .id(2L)
                                    .purchaseDate(LocalDate.parse("2024-06-01"))
                                    .price(BigDecimal.valueOf(100L))
                                    .product(product)
                                    .customer(customer)
                                    .code("6A-1000-02").build());

        supports = List.of(Support.builder()
                                  .id(1L)
                                  .fromDate(LocalDate.parse("2023-05-01"))
                                  .toDate(LocalDate.parse("2025-05-01"))
                                  .status(SupportStatus.EXPIRED)
                                  .license(licenses.get(0))
                                  .build(),
                            Support.builder()
                            .id(2L)
                            .fromDate(LocalDate.parse("2024-06-01"))
                            .toDate(LocalDate.parse("2025-06-01"))
                            .status(SupportStatus.ACTIVE)
                            .license(licenses.get(1))
                            .build()
                    );
        License license = licenses.get(0);
        List<Support> licenseSupports = new ArrayList<>();
        licenseSupports.add(supports.get(0));
        license.setSupports(licenseSupports);
        license.setLastSupport(supports.get(0));

        license = licenses.get(1);
        licenseSupports = new ArrayList<>();
        licenseSupports.add(supports.get(1));
        license.setSupports(licenseSupports);
        license.setLastSupport(supports.get(1));

        repository.save(licenses.get(0));
        repository.save(licenses.get(1));
    }

    @Test
    public void findByLastSupportToDateBefore_thenLicensesAreReturned() {
        List<License> result = repository.findByLastSupportFromDateAfterToDateBefore(
          LocalDate.parse("2024-05-01"), LocalDate.parse("2024-05-31") );
          assertNotNull(result);
          assertEquals (licenses.get(0).getId(), result.get(0).getId());
  
    }


}

package com.jccs.geslic.license;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.jccs.geslic.common.AbstractEntity;
import com.jccs.geslic.customer.Customer;
import com.jccs.geslic.product.Product;
import com.jccs.geslic.support.Support;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@SuperBuilder(toBuilder = true)
@Entity
@Table(name="licenses")
public class License extends AbstractEntity {
    private String code;
    
    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private Product product;
    
    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName= "id")
    private Customer customer;
    
    @OneToMany(fetch = FetchType.LAZY, mappedBy="license", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Support> supports;
}
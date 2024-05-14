package com.jccs.geslic.product;

import java.math.BigDecimal;

import com.jccs.geslic.common.AbstractEntity;

import jakarta.persistence.Entity;
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
@Table(name="products")
public class Product extends AbstractEntity{
 
    private String     name;
    private String     description;
    private BigDecimal price;
}

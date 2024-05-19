package com.jccs.geslic.customer;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.jccs.geslic.common.AbstractEntity;
import com.jccs.geslic.license.License;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
@Table(name="customers")
public class Customer extends AbstractEntity {
    String name;
    @OneToMany(fetch = FetchType.LAZY, mappedBy="customer", cascade = CascadeType.ALL)
    @JsonManagedReference
    List<License> licenses;
}

package com.jccs.geslic.support;

import java.time.LocalDate;
import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.jccs.geslic.common.AbstractEntity;
import com.jccs.geslic.license.License;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name="supports")
public class Support extends AbstractEntity{

    private LocalDate fromDate;
    private LocalDate toDate;
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    private SupportStatus status;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="license_id", nullable=false)
    @JsonBackReference    
    private License license;
}

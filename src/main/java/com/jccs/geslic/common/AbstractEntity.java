package com.jccs.geslic.common;


import java.io.Serializable;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.id.enhanced.SequenceStyleGenerator;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@SuppressWarnings("deprecation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true) 
@MappedSuperclass
public abstract class AbstractEntity implements Serializable {
    @Id
@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "custom_gen")
    @GenericGenerator(name = "custom_gen", strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator",
            parameters = {
                    @Parameter(name = SequenceStyleGenerator.CONFIG_SEQUENCE_PER_ENTITY_SUFFIX, value = "_seq"),
                    @Parameter(name = SequenceStyleGenerator.INITIAL_PARAM, value = "1"),
                    @Parameter(name = SequenceStyleGenerator.INCREMENT_PARAM, value = "1")})
    @Column(updatable = false, nullable = false)
    private Long       id;
    
    @CreationTimestamp
    @Column(updatable = false)
    @JsonIgnore
    private LocalDateTime createdDate;

    @UpdateTimestamp
    @JsonIgnore
    private LocalDateTime lastModifiedDate;
    
}

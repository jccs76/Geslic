package com.jccs.geslic.license;



import java.util.List;

import com.jccs.geslic.common.AbstractEntity;
import com.jccs.geslic.support.Support;

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
@Table(name="licenses")
public class License extends AbstractEntity {
    private String code;
    
    @OneToMany(fetch = FetchType.LAZY, mappedBy="license", cascade = CascadeType.ALL)
    
    private List<Support> supports;
}

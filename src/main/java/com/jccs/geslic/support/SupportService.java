package com.jccs.geslic.support;

import org.springframework.stereotype.Service;

import com.jccs.geslic.common.AbstractService;

@Service
public class SupportService extends AbstractService<SupportDTO, Support, SupportMapper, SupportRepository> {

    public SupportService(SupportRepository repository, SupportMapper mapper) {
        super(repository, mapper);
    }
    
}

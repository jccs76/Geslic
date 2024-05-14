package com.jccs.geslic.support;

import com.jccs.geslic.common.AbstractService;

public class SupportService extends AbstractService<SupportDTO, Support, SupportMapper, SupportRepository> {

    public SupportService(SupportRepository repository, SupportMapper mapper) {
        super(repository, mapper);
    }

}

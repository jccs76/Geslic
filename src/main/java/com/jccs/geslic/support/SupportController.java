package com.jccs.geslic.support;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jccs.geslic.common.AbstractController;

@RestController
@RequestMapping("/api/v1/supports")
public class SupportController extends AbstractController<SupportDTO, SupportService>{
    
    SupportController(SupportService service){
        super(service);
    }

    
}

package com.jccs.geslic.license;

import org.springframework.web.bind.annotation.RestController;

import com.jccs.geslic.common.AbstractController;

import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/api/v1/licenses")
public class LicenseController extends AbstractController<LicenseDTO, LicenseService> {
    LicenseController(LicenseService service) {
        super(service);
    }
}

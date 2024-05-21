package com.jccs.geslic.license;

import org.springframework.web.bind.annotation.RestController;

import com.jccs.geslic.common.AbstractController;
import com.jccs.geslic.support.SupportDTO;

import java.util.List;
import java.time.LocalDate;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/api/v1/licenses")
public class LicenseController extends AbstractController<LicenseDTO, LicenseService> {    
    LicenseController(LicenseService service) {
        super(service);
    }

    @GetMapping("/{id}/supports")
    public ResponseEntity<List<SupportDTO>> getAllSupports(@PathVariable("id") Long id) {
        return ResponseEntity.ok(super.getService().getSupports(id));
    }

    @GetMapping("/{id}/supports/last")
    public ResponseEntity<SupportDTO> getLastSupport(@PathVariable("id") Long id) {
        return ResponseEntity.ok(super.getService().getLastSupport(id));
    }

    @GetMapping("/{id}/supports/last/renew")
    public  ResponseEntity<LicenseDTO> renewSupport(@PathVariable("id") Long id) {
        return ResponseEntity.ok(super.getService().renewSupport(id));
    }

    @GetMapping("/{id}/supports/last/cancel")
    public  ResponseEntity<LicenseDTO> cancelSupport(@PathVariable("id") Long id) {
        return ResponseEntity.ok(super.getService().cancelSupport(id));
    }

    @GetMapping("/lastmonth")
    public ResponseEntity<List<LicenseDTO>> getLastMonth() {
        LocalDate testDate = LocalDate.parse("2024-05-31");
        return ResponseEntity.ok(super.getService().getLicensesBetween(testDate));
    }


}

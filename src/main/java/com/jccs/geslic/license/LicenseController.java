package com.jccs.geslic.license;

import org.springframework.web.bind.annotation.RestController;

import com.jccs.geslic.common.AbstractController;
import com.jccs.geslic.support.SupportDTO;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
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

    @GetMapping("/thismonth")
    public ResponseEntity<List<LicenseDTO>> getSupportThisMonth() {
        return ResponseEntity.ok(super.getService().getLicensesLastSupportThisMonth());
    }

    @GetMapping("/from/{fromDate}/to/{toDate}")
    public ResponseEntity<List<LicenseDTO>> getSupportBetweenDates(@PathVariable("fromDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                                                   @PathVariable("toDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        return ResponseEntity.ok(super.getService().getLicensesLastSupportBetween(fromDate, toDate));
    }
}

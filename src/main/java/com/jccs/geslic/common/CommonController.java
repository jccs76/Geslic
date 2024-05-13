package com.jccs.geslic.common;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

public interface CommonController<E extends Record> {
 
    @GetMapping
    ResponseEntity<List<E>> getAll();

    @GetMapping("/{id}")    
    ResponseEntity<E> get(@PathVariable("id") Long id);

    @PostMapping
    ResponseEntity<E> create(@RequestBody E dto);

    @PutMapping("/{id}")
    ResponseEntity<E> update(@PathVariable("id") Long id, @RequestBody E dto);

    @DeleteMapping("/{id}")
    ResponseEntity<?> delete (@PathVariable("id") Long id);

}

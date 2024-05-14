package com.jccs.geslic.common;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.RecordComponent;
import java.net.URI;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import lombok.Getter;

@Getter
public abstract class AbstractController <E extends Record, S extends CommonService<E>>
        implements CommonController<E> {
 
    private S service;
 
    protected AbstractController(S service) {
        this.service = service;
    }

    @Override
    public ResponseEntity<List<E>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @Override
    public ResponseEntity<E> get(Long id) {
        return ResponseEntity.ok(service.get(id));
    }

    @Override
    public ResponseEntity<E> create(@RequestBody E dto) {
        E dtoCreated = service.create(dto);
        RecordComponent[] rc = dtoCreated.getClass().getRecordComponents();
        URI location;
        try {
            location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").
                buildAndExpand(rc[0].getAccessor().invoke(dtoCreated)).toUri();
            return ResponseEntity.created(location).body(dtoCreated);
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(dtoCreated, HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<E> update(Long id, E dto) {
        return ResponseEntity.ok().body(service.update(id, dto));    
    }

    @Override
    public ResponseEntity<?> delete(Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }    
}


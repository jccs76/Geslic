package com.jccs.geslic.common.exception;

public class ConstraintViolationException extends RuntimeException {
    public ConstraintViolationException (String msg) {
        super(msg);
    }
}

package com.jccs.geslic.common.exception;

public class EntityExistingException extends RuntimeException {
    public EntityExistingException (String msg) {
        super(msg);
    }
}

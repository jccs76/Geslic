package com.jccs.geslic.common;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.mapstruct.Qualifier;

@Qualifier // org.mapstruct.Qualifier
@Target({ElementType.TYPE,ElementType.METHOD})
@Retention(RetentionPolicy.CLASS)
public @interface EncodedMapping {
}
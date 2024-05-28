package com.jccs.geslic.util;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.jccs.geslic.support.SupportRepository;

@Component
public class CronScheduledTask {
    @Autowired
    SupportRepository supportRepository;
    
    @Scheduled(cron = "0 0 0 * * *") //Executes everyday at 00:00
    public void runCronTask() {
        LocalDate today = LocalDate.ofInstant(Instant.now(), ZoneId.systemDefault());
        supportRepository.updateSupportStatusWhenExpires(today);
    }

    @Scheduled(fixedDelay = 5000) //Executes every 5 seconds, THIS IS ONLY FOR DEMO PURPOSES
    public void runFixedDelayTask() {
        LocalDate today = LocalDate.ofInstant(Instant.now(), ZoneId.systemDefault());
        supportRepository.updateSupportStatusWhenExpires(today);
    }
}

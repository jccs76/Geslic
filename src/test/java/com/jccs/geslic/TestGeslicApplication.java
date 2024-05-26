package com.jccs.geslic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.testcontainers.containers.OracleContainer;
import org.testcontainers.utility.DockerImageName;

@TestConfiguration(proxyBeanMethods = false)
public class TestGeslicApplication {

	@SuppressWarnings("resource")
	@Bean
	@ServiceConnection
	OracleContainer oracleFreeContainer() {
		return new OracleContainer(DockerImageName.parse("gvenzl/oracle-xe:21-slim-faststart"))
			.withDatabaseName("geslicdb")
			.withUsername("testuser")
			.withPassword(("testpwd"))
			.withReuse(true);        

	}

	public static void main(String[] args) {
		SpringApplication.from(GeslicApplication::main).with(TestGeslicApplication.class).run(args);
		
	}

}

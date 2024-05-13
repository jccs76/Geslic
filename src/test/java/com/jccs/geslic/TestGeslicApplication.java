package com.jccs.geslic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.devtools.restart.RestartScope;
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
	@RestartScope
	OracleContainer oracleFreeContainer() {
		return new OracleContainer(DockerImageName.parse("gvenzl/oracle-xe:18.4.0-slim"))
			.withDatabaseName("geslicdb")
			.withUsername("testuser")
			.withPassword(("testpwd"));        

	}

	public static void main(String[] args) {
		SpringApplication.from(GeslicApplication::main).with(TestGeslicApplication.class).run(args);
		
	}

}

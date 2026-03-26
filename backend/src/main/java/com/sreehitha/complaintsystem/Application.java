package com.sreehitha.complaintsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.web.servlet.FilterRegistrationBean;

import com.sreehitha.complaintsystem.security.JwtFilter;

@SpringBootApplication
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Bean
	public FilterRegistrationBean<JwtFilter> jwtFilter() {

    	JwtFilter filter = new JwtFilter(); // ✅ manually create

    	FilterRegistrationBean<JwtFilter> registration = new FilterRegistrationBean<>();
    	registration.setFilter(filter);

    	registration.addUrlPatterns("/api/complaints", "/api/complaints/*");

    	return registration;
	}
}
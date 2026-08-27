package com.example.project_management.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

	private final JwtAuthenticationFilter jwtAuthenticationFilter;

	public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {

		this.jwtAuthenticationFilter = jwtAuthenticationFilter;
	}

	@Bean
	public PasswordEncoder passwordEncoder() {

		return new BCryptPasswordEncoder();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {

		CorsConfiguration configuration = new CorsConfiguration();

		configuration.setAllowedOrigins(List.of("http://localhost:5173"));

		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

		configuration.setAllowedHeaders(List.of("*"));

		configuration.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

		source.registerCorsConfiguration("/**", configuration);

		return source;
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		http

				.cors(cors -> cors.configurationSource(corsConfigurationSource()))

				.csrf(csrf -> csrf.disable())

				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

				.authorizeHttpRequests(auth -> auth

						// Authentication
						.requestMatchers("/api/auth/**").permitAll()

						.requestMatchers("/api/projects/**")
						.hasAnyRole("SUPER_ADMIN", "PROJECT_ADMIN", "PROJECT_MANAGER", "TEAM_LEAD", "EMPLOYEE")

						// Task access
						.requestMatchers("/api/tasks/**")
						.hasAnyRole("SUPER_ADMIN", "PROJECT_ADMIN", "PROJECT_MANAGER", "TEAM_LEAD", "EMPLOYEE")

						// Timesheet approve / reject
						.requestMatchers("/api/timesheets/*/approve", "/api/timesheets/*/reject")
						.hasAnyRole("SUPER_ADMIN", "PROJECT_ADMIN", "PROJECT_MANAGER")

						// Timesheet access
						.requestMatchers("/api/timesheets/**")
						.hasAnyRole("SUPER_ADMIN", "PROJECT_ADMIN", "PROJECT_MANAGER", "TEAM_LEAD", "EMPLOYEE")

						// Everything else
						// Everything else
						.requestMatchers("/").permitAll()
						.anyRequest().authenticated())

				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}
}
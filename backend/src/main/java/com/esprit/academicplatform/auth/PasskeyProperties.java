package com.esprit.academicplatform.auth;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.passkey")
public class PasskeyProperties {

    private String rpId = "localhost";
    private String origin = "http://localhost:4200";
    private String rpName = "ESPRIT Academic Platform";
    private long challengeTtlMinutes = 5;
    private long timeoutMs = 60000;
}

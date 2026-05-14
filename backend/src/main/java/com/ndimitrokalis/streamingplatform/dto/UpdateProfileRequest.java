package com.ndimitrokalis.streamingplatform.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequest {

    @Size(min = 2, max = 50)
    private String displayName;

    @Pattern(regexp = "^$|^\\+?[0-9\\s]{7,20}$", message = "Invalid phone number format")
    private String phone;

    @Size(max = 60)
    private String country;
}

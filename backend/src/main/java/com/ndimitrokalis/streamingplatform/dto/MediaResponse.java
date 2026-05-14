package com.ndimitrokalis.streamingplatform.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MediaResponse {

    private Long id;
    private String title;
    private String description;
    private String genre;
    private String type;
    private String thumbnailUrl;
    private String videoUrl;
    private Integer durationSeconds;
    private Integer releaseYear;
}

package com.ndimitrokalis.streamingplatform.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WatchSessionResponse {

    private Long id;
    private String roomId;
    private String hostEmail;
    private String hostDisplayName;
    private Long mediaId;
    private String mediaTitle;
    private Integer playbackTimestamp;
    private boolean active;
    private LocalDateTime createdAt;
    private List<Map<String, String>> members;
}

package com.ndimitrokalis.streamingplatform.websocket;

import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionSyncMessage {

    private String type;
    private String roomId;
    private String userId;
    private String timestamp;
    private Boolean playing;
    private String newHostEmail;
    private String newHostDisplayName;
    private String displayName;
    private List<Map<String, String>> participants;
}

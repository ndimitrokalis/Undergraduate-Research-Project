package com.ndimitrokalis.streamingplatform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "watch_history",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "media_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WatchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "media_id", nullable = false)
    private Media media;

    @Column(nullable = false)
    private Integer progressSeconds;

    private boolean completed;

    @Column(nullable = false)
    private LocalDateTime lastWatchedAt;

    @PrePersist
    protected void onCreate() {
        this.lastWatchedAt = LocalDateTime.now();
        if (this.progressSeconds == null) {
            this.progressSeconds = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.lastWatchedAt = LocalDateTime.now();
    }
}

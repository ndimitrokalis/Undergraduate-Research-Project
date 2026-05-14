package com.ndimitrokalis.streamingplatform.service;

import com.ndimitrokalis.streamingplatform.dto.MediaResponse;
import com.ndimitrokalis.streamingplatform.model.Media;
import com.ndimitrokalis.streamingplatform.repository.MediaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MediaService {

    private final MediaRepository mediaRepository;

    public List<MediaResponse> getAllMedia() {
        return mediaRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public MediaResponse getMediaById(Long id) {
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Media not found"));
        return toResponse(media);
    }

    public List<MediaResponse> searchByTitle(String title) {
        return mediaRepository.findByTitleContainingIgnoreCase(title).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<MediaResponse> getByGenre(String genre) {
        return mediaRepository.findByGenre(genre).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<MediaResponse> getByType(String type) {
        return mediaRepository.findByType(type).stream()
                .map(this::toResponse)
                .toList();
    }

    private MediaResponse toResponse(Media media) {
        return MediaResponse.builder()
                .id(media.getId())
                .title(media.getTitle())
                .description(media.getDescription())
                .genre(media.getGenre())
                .type(media.getType())
                .thumbnailUrl(media.getThumbnailUrl())
                .videoUrl(media.getVideoUrl())
                .durationSeconds(media.getDurationSeconds())
                .releaseYear(media.getReleaseYear())
                .build();
    }
}

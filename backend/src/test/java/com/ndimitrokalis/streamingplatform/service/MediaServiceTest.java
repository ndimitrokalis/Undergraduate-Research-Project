package com.ndimitrokalis.streamingplatform.service;

import com.ndimitrokalis.streamingplatform.dto.MediaResponse;
import com.ndimitrokalis.streamingplatform.model.Media;
import com.ndimitrokalis.streamingplatform.repository.MediaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MediaServiceTest {

    @Mock private MediaRepository mediaRepository;
    @InjectMocks private MediaService mediaService;

    private Media buildMedia(Long id, String title, String genre, String type) {
        return Media.builder()
                .id(id)
                .title(title)
                .genre(genre)
                .type(type)
                .videoUrl("/movies/test.mp4")
                .durationSeconds(60)
                .releaseYear(2024)
                .build();
    }

    @Test
    void getAllMedia_shouldReturnAllMedia() {
        List<Media> media = List.of(
                buildMedia(1L, "Movie A", "Action", "MOVIE"),
                buildMedia(2L, "Series B", "Drama", "SERIES")
        );
        when(mediaRepository.findAll()).thenReturn(media);

        List<MediaResponse> result = mediaService.getAllMedia();

        assertEquals(2, result.size());
        assertEquals("Movie A", result.get(0).getTitle());
        assertEquals("Series B", result.get(1).getTitle());
    }

    @Test
    void getMediaById_shouldReturnMedia() {
        Media media = buildMedia(1L, "Test Movie", "Thriller", "MOVIE");
        when(mediaRepository.findById(1L)).thenReturn(Optional.of(media));

        MediaResponse result = mediaService.getMediaById(1L);

        assertEquals("Test Movie", result.getTitle());
        assertEquals("Thriller", result.getGenre());
        assertEquals("MOVIE", result.getType());
    }

    @Test
    void getMediaById_shouldThrowWhenNotFound() {
        when(mediaRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> mediaService.getMediaById(99L));
        assertEquals("Media not found", ex.getMessage());
    }

    @Test
    void searchByTitle_shouldReturnMatchingMedia() {
        List<Media> media = List.of(buildMedia(1L, "Dark Horizon", "Thriller", "MOVIE"));
        when(mediaRepository.findByTitleContainingIgnoreCase("dark")).thenReturn(media);

        List<MediaResponse> result = mediaService.searchByTitle("dark");

        assertEquals(1, result.size());
        assertEquals("Dark Horizon", result.get(0).getTitle());
    }

    @Test
    void searchByTitle_shouldReturnEmptyForNoMatch() {
        when(mediaRepository.findByTitleContainingIgnoreCase("nonexistent")).thenReturn(List.of());

        List<MediaResponse> result = mediaService.searchByTitle("nonexistent");

        assertTrue(result.isEmpty());
    }

    @Test
    void getByGenre_shouldReturnFilteredMedia() {
        List<Media> media = List.of(
                buildMedia(1L, "Movie A", "Action", "MOVIE"),
                buildMedia(2L, "Movie B", "Action", "MOVIE")
        );
        when(mediaRepository.findByGenre("Action")).thenReturn(media);

        List<MediaResponse> result = mediaService.getByGenre("Action");

        assertEquals(2, result.size());
        result.forEach(r -> assertEquals("Action", r.getGenre()));
    }

    @Test
    void getByType_shouldReturnFilteredMedia() {
        List<Media> movies = List.of(buildMedia(1L, "Movie A", "Action", "MOVIE"));
        when(mediaRepository.findByType("MOVIE")).thenReturn(movies);

        List<MediaResponse> result = mediaService.getByType("MOVIE");

        assertEquals(1, result.size());
        assertEquals("MOVIE", result.get(0).getType());
    }

    @Test
    void toResponse_shouldMapAllFields() {
        Media media = Media.builder()
                .id(1L)
                .title("Test")
                .description("Description")
                .genre("Sci-Fi")
                .type("SERIES")
                .thumbnailUrl("/series/test.jpg")
                .videoUrl("/series/test.mp4")
                .durationSeconds(45)
                .releaseYear(2025)
                .build();
        when(mediaRepository.findById(1L)).thenReturn(Optional.of(media));

        MediaResponse result = mediaService.getMediaById(1L);

        assertEquals(1L, result.getId());
        assertEquals("Test", result.getTitle());
        assertEquals("Description", result.getDescription());
        assertEquals("Sci-Fi", result.getGenre());
        assertEquals("SERIES", result.getType());
        assertEquals("/series/test.jpg", result.getThumbnailUrl());
        assertEquals("/series/test.mp4", result.getVideoUrl());
        assertEquals(45, result.getDurationSeconds());
        assertEquals(2025, result.getReleaseYear());
    }
}

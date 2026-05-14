package com.ndimitrokalis.streamingplatform.controller;

import com.ndimitrokalis.streamingplatform.config.SecurityConfig;
import com.ndimitrokalis.streamingplatform.dto.MediaResponse;
import com.ndimitrokalis.streamingplatform.security.JwtFilter;
import com.ndimitrokalis.streamingplatform.security.JwtUtil;
import com.ndimitrokalis.streamingplatform.service.MediaService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MediaController.class)
@Import({SecurityConfig.class, JwtFilter.class, MediaControllerTest.TestCorsConfig.class})
class MediaControllerTest {

    @TestConfiguration
    static class TestCorsConfig {
        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowedOrigins(List.of("*"));
            config.setAllowedMethods(List.of("*"));
            source.registerCorsConfiguration("/**", config);
            return source;
        }
    }

    @Autowired private MockMvc mockMvc;
    @MockitoBean private MediaService mediaService;
    @MockitoBean private JwtUtil jwtUtil;

    private MediaResponse buildResponse(Long id, String title, String genre, String type) {
        return MediaResponse.builder()
                .id(id).title(title).genre(genre).type(type)
                .videoUrl("/movies/test.mp4").durationSeconds(60).releaseYear(2024)
                .build();
    }

    @Test
    @WithMockUser
    void getAllMedia_shouldReturnMediaList() throws Exception {
        List<MediaResponse> media = List.of(
                buildResponse(1L, "Movie A", "Action", "MOVIE"),
                buildResponse(2L, "Series B", "Drama", "SERIES")
        );
        when(mediaService.getAllMedia()).thenReturn(media);

        mockMvc.perform(get("/api/media"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].title").value("Movie A"))
                .andExpect(jsonPath("$[1].title").value("Series B"));
    }

    @Test
    @WithMockUser
    void getMediaById_shouldReturnMedia() throws Exception {
        when(mediaService.getMediaById(1L)).thenReturn(buildResponse(1L, "Test Movie", "Thriller", "MOVIE"));

        mockMvc.perform(get("/api/media/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Movie"))
                .andExpect(jsonPath("$.genre").value("Thriller"))
                .andExpect(jsonPath("$.type").value("MOVIE"));
    }

    @Test
    @WithMockUser
    void getMediaById_shouldReturn400WhenNotFound() throws Exception {
        when(mediaService.getMediaById(99L)).thenThrow(new RuntimeException("Media not found"));

        mockMvc.perform(get("/api/media/99"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Media not found"));
    }

    @Test
    @WithMockUser
    void searchByTitle_shouldReturnMatchingMedia() throws Exception {
        List<MediaResponse> results = List.of(buildResponse(1L, "Dark Horizon", "Thriller", "MOVIE"));
        when(mediaService.searchByTitle("dark")).thenReturn(results);

        mockMvc.perform(get("/api/media/search").param("title", "dark"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].title").value("Dark Horizon"));
    }

    @Test
    @WithMockUser
    void getByGenre_shouldReturnFilteredMedia() throws Exception {
        List<MediaResponse> results = List.of(buildResponse(1L, "Movie A", "Action", "MOVIE"));
        when(mediaService.getByGenre("Action")).thenReturn(results);

        mockMvc.perform(get("/api/media/genre/Action"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].genre").value("Action"));
    }

    @Test
    @WithMockUser
    void getByType_shouldReturnFilteredMedia() throws Exception {
        List<MediaResponse> results = List.of(buildResponse(1L, "Movie A", "Action", "MOVIE"));
        when(mediaService.getByType("MOVIE")).thenReturn(results);

        mockMvc.perform(get("/api/media/type/MOVIE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].type").value("MOVIE"));
    }

    @Test
    void getAllMedia_shouldReturn403WhenUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/media"))
                .andExpect(status().isForbidden());
    }
}

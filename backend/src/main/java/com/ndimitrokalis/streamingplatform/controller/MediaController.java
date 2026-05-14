package com.ndimitrokalis.streamingplatform.controller;

import com.ndimitrokalis.streamingplatform.dto.MediaResponse;
import com.ndimitrokalis.streamingplatform.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @GetMapping
    public ResponseEntity<List<MediaResponse>> getAllMedia() {
        return ResponseEntity.ok(mediaService.getAllMedia());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MediaResponse> getMediaById(@PathVariable Long id) {
        return ResponseEntity.ok(mediaService.getMediaById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<MediaResponse>> searchByTitle(@RequestParam String title) {
        return ResponseEntity.ok(mediaService.searchByTitle(title));
    }

    @GetMapping("/genre/{genre}")
    public ResponseEntity<List<MediaResponse>> getByGenre(@PathVariable String genre) {
        return ResponseEntity.ok(mediaService.getByGenre(genre));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<MediaResponse>> getByType(@PathVariable String type) {
        return ResponseEntity.ok(mediaService.getByType(type));
    }
}

package com.ndimitrokalis.streamingplatform.repository;

import com.ndimitrokalis.streamingplatform.model.Media;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MediaRepository extends JpaRepository<Media, Long> {

    List<Media> findByGenre(String genre);

    List<Media> findByType(String type);

    List<Media> findByTitleContainingIgnoreCase(String title);
}

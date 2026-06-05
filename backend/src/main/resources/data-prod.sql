INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'The Dark Horizon', 'A gripping thriller set in a dystopian future where humanity faces its greatest challenge.', 'Thriller', 'MOVIE', '/movies/demo-movie-1.jpg', '/movies/demo-movie-1.mp4', 60, 2024, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'The Dark Horizon');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Ocean Blue', 'An underwater adventure exploring the deepest trenches of the Pacific Ocean.', 'Adventure', 'MOVIE', '/movies/demo-movie-2.jpg', '/movies/demo-movie-2.mp4', 45, 2024, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Ocean Blue');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Neon Nights - Episode 1', 'Pilot episode of a cyberpunk series following a hacker collective in Neo Tokyo.', 'Sci-Fi', 'SERIES', '/series/demo-series-1.jpg', '/series/demo-series-1.mp4', 90, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Neon Nights - Episode 1');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Red Storm - Episode 2', 'The team uncovers a conspiracy that threatens to bring down the entire network.', 'Sci-Fi', 'SERIES', '/series/demo-series-2.jpg', '/series/demo-series-2.mp4', 75, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Red Storm - Episode 2');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Silent Code', 'A documentary exploring the history and impact of open source software on modern society.', 'Documentary', 'MOVIE', '/movies/demo-documentary-1.jpg', '/movies/demo-documentary-1.mp4', 120, 2023, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Silent Code');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Crimson Tide Rising', 'A retired naval officer is pulled back into service when a rogue submarine threatens global security.', 'Thriller', 'MOVIE', '/movies/crimson-tide-rising.jpg', '/movies/crimson-tide-rising.mp4', 55, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Crimson Tide Rising');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'The Last Algorithm', 'A brilliant programmer discovers an AI that can predict the future, but at a devastating cost.', 'Sci-Fi', 'MOVIE', '/movies/the-last-algorithm.jpg', '/movies/the-last-algorithm.mp4', 70, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'The Last Algorithm');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Echoes of Tomorrow', 'A woman receives letters from her future self warning of an impending catastrophe.', 'Drama', 'MOVIE', '/movies/echoes-of-tomorrow.jpg', '/movies/echoes-of-tomorrow.mp4', 50, 2024, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Echoes of Tomorrow');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Frostbite', 'An expedition team gets trapped in the Arctic and must survive both the elements and something lurking beneath the ice.', 'Horror', 'MOVIE', '/movies/frostbite.jpg', '/movies/frostbite.mp4', 65, 2024, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Frostbite');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Golden Meridian', 'Two treasure hunters race across continents to find a legendary artifact before a ruthless collector.', 'Adventure', 'MOVIE', '/movies/golden-meridian.jpg', '/movies/golden-meridian.mp4', 48, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Golden Meridian');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Phantom Circuit', 'A detective investigates a series of impossible crimes linked to a mysterious underground network.', 'Thriller', 'MOVIE', '/movies/phantom-circuit.jpg', '/movies/phantom-circuit.mp4', 80, 2023, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Phantom Circuit');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Steel Horizon', 'In a world where mega-corporations rule, a factory worker uncovers a plot that could change everything.', 'Sci-Fi', 'MOVIE', '/movies/steel-horizon.jpg', '/movies/steel-horizon.mp4', 58, 2024, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Steel Horizon');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Wildfire Protocol', 'A firefighter discovers that a series of devastating wildfires are being set deliberately by a shadowy organization.', 'Action', 'MOVIE', '/movies/wildfire-protocol.jpg', '/movies/wildfire-protocol.mp4', 72, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Wildfire Protocol');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'The Quiet Storm', 'A jazz musician in 1960s New Orleans navigates fame, addiction, and the civil rights movement.', 'Drama', 'MOVIE', '/movies/the-quiet-storm.jpg', '/movies/the-quiet-storm.mp4', 63, 2023, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'The Quiet Storm');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Midnight Express', 'A journalist goes undercover in the criminal underworld and finds herself in too deep to get out.', 'Action', 'MOVIE', '/movies/midnight-express.jpg', '/movies/midnight-express.mp4', 90, 2024, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Midnight Express');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Cyber Nexus - Episode 1', 'A cybersecurity analyst stumbles onto a global conspiracy when she traces a hack back to a government black site.', 'Thriller', 'SERIES', '/series/cyber-nexus---episode-1.jpg', '/series/cyber-nexus---episode-1.mp4', 42, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Cyber Nexus - Episode 1');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Cyber Nexus - Episode 2', 'The team goes off-grid as the conspiracy deepens and allies become suspects.', 'Thriller', 'SERIES', '/series/cyber-nexus---episode-2.jpg', '/series/cyber-nexus---episode-2.mp4', 45, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Cyber Nexus - Episode 2');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Cyber Nexus - Episode 3', 'A shocking betrayal forces the team into a desperate final gambit to expose the truth.', 'Thriller', 'SERIES', '/series/cyber-nexus---episode-3.jpg', '/series/cyber-nexus---episode-3.mp4', 40, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Cyber Nexus - Episode 3');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Dark Signals - Episode 1', 'A radio astronomer picks up a repeating signal from deep space that defies all known science.', 'Sci-Fi', 'SERIES', '/series/dark-signals---episode-1.jpg', '/series/dark-signals---episode-1.mp4', 50, 2024, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Dark Signals - Episode 1');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Dark Signals - Episode 2', 'The signal''s origin is traced to an abandoned research station with a terrifying history.', 'Sci-Fi', 'SERIES', '/series/dark-signals---episode-2.jpg', '/series/dark-signals---episode-2.mp4', 48, 2024, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Dark Signals - Episode 2');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Dark Signals - Episode 3', 'First contact is made, but the message is not what anyone expected.', 'Sci-Fi', 'SERIES', '/series/dark-signals---episode-3.jpg', '/series/dark-signals---episode-3.mp4', 52, 2024, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Dark Signals - Episode 3');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Lost Colony - Episode 1', 'Settlers on a distant planet lose contact with Earth and must forge a new society from scratch.', 'Adventure', 'SERIES', '/series/lost-colony---episode-1.jpg', '/series/lost-colony---episode-1.mp4', 55, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Lost Colony - Episode 1');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Lost Colony - Episode 2', 'A power struggle erupts as resources dwindle and a mysterious native species emerges.', 'Adventure', 'SERIES', '/series/lost-colony---episode-2.jpg', '/series/lost-colony---episode-2.mp4', 47, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Lost Colony - Episode 2');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'The Watchers - Episode 1', 'A group of strangers realize they are being observed by an unseen force that controls their every move.', 'Horror', 'SERIES', '/series/the-watchers---episode-1.jpg', '/series/the-watchers---episode-1.mp4', 44, 2024, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'The Watchers - Episode 1');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'The Watchers - Episode 2', 'The group attempts to escape but discovers the boundaries of their prison are not physical.', 'Horror', 'SERIES', '/series/the-watchers---episode-2.jpg', '/series/the-watchers---episode-2.mp4', 46, 2024, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'The Watchers - Episode 2');

-- Thriller Movies
INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Shattered Glass', 'A forensic analyst uncovers a web of lies when evidence from a high-profile case begins to contradict itself.', 'Thriller', 'MOVIE', '/movies/shattered-glass.jpg', '/movies/shattered-glass.mp4', 50, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Shattered Glass');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'The Last Witness', 'The sole survivor of a plane crash holds the key to a conspiracy that powerful people want buried.', 'Thriller', 'MOVIE', '/movies/the-last-witness.jpg', '/movies/the-last-witness.mp4', 55, 2024, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'The Last Witness');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Dead Drop', 'A spy courier discovers the package she has been carrying contains evidence of her own agency''s betrayal.', 'Thriller', 'MOVIE', '/movies/dead-drop.jpg', '/movies/dead-drop.mp4', 48, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Dead Drop');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Blind Spot', 'A blind detective uses her heightened senses to track a serial killer the police cannot catch.', 'Thriller', 'MOVIE', '/movies/blind-spot.jpg', '/movies/blind-spot.mp4', 52, 2024, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Blind Spot');

-- Thriller Series
INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Night Protocol - Episode 1', 'An elite cyber unit is activated when a coordinated attack takes down global banking systems.', 'Thriller', 'SERIES', '/series/night-protocol---episode-1.jpg', '/series/night-protocol---episode-1.mp4', 40, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Night Protocol - Episode 1');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Night Protocol - Episode 2', 'The team traces the attack to an insider and must decide who they can trust.', 'Thriller', 'SERIES', '/series/night-protocol---episode-2.jpg', '/series/night-protocol---episode-2.mp4', 42, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Night Protocol - Episode 2');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Night Protocol - Episode 3', 'A decoy operation goes wrong, leaving half the unit compromised behind enemy lines.', 'Thriller', 'SERIES', '/series/night-protocol---episode-3.jpg', '/series/night-protocol---episode-3.mp4', 38, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Night Protocol - Episode 3');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Night Protocol - Episode 4', 'The final confrontation reveals the true architect of the attack and forces an impossible choice.', 'Thriller', 'SERIES', '/series/night-protocol---episode-4.jpg', '/series/night-protocol---episode-4.mp4', 44, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Night Protocol - Episode 4');

-- Adventure Movies
INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'The Lost Expedition', 'A team of explorers follows a century-old map to find a hidden valley untouched by civilization.', 'Adventure', 'MOVIE', '/movies/the-lost-expedition.jpg', '/movies/the-lost-expedition.mp4', 60, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'The Lost Expedition');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Uncharted Waters', 'A marine archaeologist discovers coordinates to a sunken fleet carrying ancient relics of immense power.', 'Adventure', 'MOVIE', '/movies/uncharted-waters.jpg', '/movies/uncharted-waters.mp4', 55, 2024, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Uncharted Waters');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Summit of Fire', 'Two rival mountaineers race to be first to summit an active volcano before it erupts.', 'Adventure', 'MOVIE', '/movies/summit-of-fire.jpg', '/movies/summit-of-fire.mp4', 50, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Summit of Fire');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'The Jade Temple', 'Deep in the jungles of Southeast Asia, a historian searches for a temple said to grant immortality.', 'Adventure', 'MOVIE', '/movies/the-jade-temple.jpg', '/movies/the-jade-temple.mp4', 58, 2024, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'The Jade Temple');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Beyond the Horizon', 'A solo sailor embarks on a round-the-world voyage and encounters a mysterious island not on any chart.', 'Adventure', 'MOVIE', '/movies/beyond-the-horizon.jpg', '/movies/beyond-the-horizon.mp4', 52, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Beyond the Horizon');

-- Adventure Series
INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Trail Blazers - Episode 1', 'Five strangers are dropped into the wilderness with minimal supplies and must find their way to civilization.', 'Adventure', 'SERIES', '/series/trail-blazers---episode-1.jpg', '/series/trail-blazers---episode-1.mp4', 35, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Trail Blazers - Episode 1');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Trail Blazers - Episode 2', 'The group faces their first river crossing as tensions rise over leadership.', 'Adventure', 'SERIES', '/series/trail-blazers---episode-2.jpg', '/series/trail-blazers---episode-2.mp4', 38, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Trail Blazers - Episode 2');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Trail Blazers - Episode 3', 'A member goes missing during a storm, and the team must decide whether to press on or search.', 'Adventure', 'SERIES', '/series/trail-blazers---episode-3.jpg', '/series/trail-blazers---episode-3.mp4', 36, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Trail Blazers - Episode 3');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Trail Blazers - Episode 4', 'The discovery of ancient cave paintings suggests they are not the first to travel this route.', 'Adventure', 'SERIES', '/series/trail-blazers---episode-4.jpg', '/series/trail-blazers---episode-4.mp4', 40, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Trail Blazers - Episode 4');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Trail Blazers - Episode 5', 'The final stretch pushes every member to their limit as rescue becomes a race against time.', 'Adventure', 'SERIES', '/series/trail-blazers---episode-5.jpg', '/series/trail-blazers---episode-5.mp4', 37, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Trail Blazers - Episode 5');

-- Sci-Fi Movies
INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Neural Link', 'A neuroscientist tests a brain-computer interface on herself and begins experiencing another person''s memories.', 'Sci-Fi', 'MOVIE', '/movies/neural-link.jpg', '/movies/neural-link.mp4', 55, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Neural Link');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'The Terraform Project', 'The first colonists on Mars discover the planet is already changing itself to support life.', 'Sci-Fi', 'MOVIE', '/movies/the-terraform-project.jpg', '/movies/the-terraform-project.mp4', 60, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'The Terraform Project');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Gravity Well', 'A research station near a black hole experiences time at different rates on each deck, tearing the crew apart.', 'Sci-Fi', 'MOVIE', '/movies/gravity-well.jpg', '/movies/gravity-well.mp4', 50, 2024, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Gravity Well');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Binary Sunset', 'On a planet with two suns, a linguist tries to communicate with a silicon-based life form before war breaks out.', 'Sci-Fi', 'MOVIE', '/movies/binary-sunset.jpg', '/movies/binary-sunset.mp4', 48, 2024, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Binary Sunset');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Event Horizon Zero', 'A quantum physicist accidentally opens a portal to a parallel universe where Earth never existed.', 'Sci-Fi', 'MOVIE', '/movies/event-horizon-zero.jpg', '/movies/event-horizon-zero.mp4', 56, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Event Horizon Zero');

-- Sci-Fi Series
INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Quantum Drift - Episode 1', 'A physicist is scattered across multiple timelines and must reassemble her consciousness to return home.', 'Sci-Fi', 'SERIES', '/series/quantum-drift---episode-1.jpg', '/series/quantum-drift---episode-1.mp4', 42, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Quantum Drift - Episode 1');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Quantum Drift - Episode 2', 'Each timeline holds a fragment of the solution but also a version of herself that refuses to let go.', 'Sci-Fi', 'SERIES', '/series/quantum-drift---episode-2.jpg', '/series/quantum-drift---episode-2.mp4', 45, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Quantum Drift - Episode 2');

-- Drama Movies
INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Broken Strings', 'A concert violinist loses her hearing and must find a new way to connect with the music she loves.', 'Drama', 'MOVIE', '/movies/broken-strings.jpg', '/movies/broken-strings.mp4', 65, 2024, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Broken Strings');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'The Long Goodbye', 'A family gathers at their childhood home one last time before it is sold, unearthing buried secrets.', 'Drama', 'MOVIE', '/movies/the-long-goodbye.jpg', '/movies/the-long-goodbye.mp4', 58, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'The Long Goodbye');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Paper Walls', 'Two neighbours in a thin-walled apartment building share an unlikely friendship through overheard conversations.', 'Drama', 'MOVIE', '/movies/paper-walls.jpg', '/movies/paper-walls.mp4', 52, 2024, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Paper Walls');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Still Waters', 'A retired fisherman mentors a troubled teenager, and both discover healing in the quiet rhythm of the lake.', 'Drama', 'MOVIE', '/movies/still-waters.jpg', '/movies/still-waters.mp4', 60, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Still Waters');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Autumn Leaves', 'A poet returns to her hometown after decades and confronts the love she left behind.', 'Drama', 'MOVIE', '/movies/autumn-leaves.jpg', '/movies/autumn-leaves.mp4', 55, 2024, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Autumn Leaves');

-- Drama Series
INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'The Olive Tree - Episode 1', 'Three generations of a Greek family clash over the future of their ancestral olive grove.', 'Drama', 'SERIES', '/series/the-olive-tree---episode-1.jpg', '/series/the-olive-tree---episode-1.mp4', 38, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'The Olive Tree - Episode 1');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'The Olive Tree - Episode 2', 'A developer offers a fortune for the land, splitting the family down the middle.', 'Drama', 'SERIES', '/series/the-olive-tree---episode-2.jpg', '/series/the-olive-tree---episode-2.mp4', 40, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'The Olive Tree - Episode 2');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'The Olive Tree - Episode 3', 'Old letters surface revealing a wartime promise that complicates the inheritance.', 'Drama', 'SERIES', '/series/the-olive-tree---episode-3.jpg', '/series/the-olive-tree---episode-3.mp4', 36, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'The Olive Tree - Episode 3');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'The Olive Tree - Episode 4', 'The youngest granddaughter secretly begins restoring the grove, defying the family vote.', 'Drama', 'SERIES', '/series/the-olive-tree---episode-4.jpg', '/series/the-olive-tree---episode-4.mp4', 42, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'The Olive Tree - Episode 4');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'The Olive Tree - Episode 5', 'A harvest festival reunites estranged relatives and forces old wounds into the open.', 'Drama', 'SERIES', '/series/the-olive-tree---episode-5.jpg', '/series/the-olive-tree---episode-5.mp4', 39, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'The Olive Tree - Episode 5');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'The Olive Tree - Episode 6', 'The grandmother reveals a final secret that changes everything the family believed.', 'Drama', 'SERIES', '/series/the-olive-tree---episode-6.jpg', '/series/the-olive-tree---episode-6.mp4', 41, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'The Olive Tree - Episode 6');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'The Olive Tree - Episode 7', 'The family makes their final decision as the olive trees bloom for another season.', 'Drama', 'SERIES', '/series/the-olive-tree---episode-7.jpg', '/series/the-olive-tree---episode-7.mp4', 37, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'The Olive Tree - Episode 7');

-- Horror Movies
INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'The Hollow', 'A family moves into a farmhouse where the previous occupants vanished without a trace.', 'Horror', 'MOVIE', '/movies/the-hollow.jpg', '/movies/the-hollow.mp4', 50, 2024, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'The Hollow');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Crimson Cellar', 'A wine collector discovers a hidden room beneath his cellar that should not exist.', 'Horror', 'MOVIE', '/movies/crimson-cellar.jpg', '/movies/crimson-cellar.mp4', 55, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Crimson Cellar');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Whispering Pines', 'Campers in a remote forest begin hearing voices that mimic their dead relatives.', 'Horror', 'MOVIE', '/movies/whispering-pines.jpg', '/movies/whispering-pines.mp4', 48, 2024, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Whispering Pines');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'The Last Door', 'A hotel with infinite hallways traps guests who open the one door marked Do Not Enter.', 'Horror', 'MOVIE', '/movies/the-last-door.jpg', '/movies/the-last-door.mp4', 52, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'The Last Door');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Shadow Crawl', 'A night-shift security guard notices the shadows in his building are moving independently of their sources.', 'Horror', 'MOVIE', '/movies/shadow-crawl.jpg', '/movies/shadow-crawl.mp4', 46, 2024, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Shadow Crawl');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Bone Garden', 'An archaeologist excavating a medieval graveyard awakens something that was buried alive for a reason.', 'Horror', 'MOVIE', '/movies/bone-garden.jpg', '/movies/bone-garden.mp4', 54, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Bone Garden');

-- Horror Series
INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'The Haunting Hour - Episode 1', 'A paranormal investigator takes on a case in an abandoned asylum with a dark history.', 'Horror', 'SERIES', '/series/the-haunting-hour---episode-1.jpg', '/series/the-haunting-hour---episode-1.mp4', 38, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'The Haunting Hour - Episode 1');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'The Haunting Hour - Episode 2', 'The recordings from the first night reveal voices that were not there during the investigation.', 'Horror', 'SERIES', '/series/the-haunting-hour---episode-2.jpg', '/series/the-haunting-hour---episode-2.mp4', 40, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'The Haunting Hour - Episode 2');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'The Haunting Hour - Episode 3', 'A medium joins the team and makes contact with an entity that does not want to be found.', 'Horror', 'SERIES', '/series/the-haunting-hour---episode-3.jpg', '/series/the-haunting-hour---episode-3.mp4', 36, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'The Haunting Hour - Episode 3');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'The Haunting Hour - Episode 4', 'The team is separated when the building seems to rearrange itself around them.', 'Horror', 'SERIES', '/series/the-haunting-hour---episode-4.jpg', '/series/the-haunting-hour---episode-4.mp4', 42, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'The Haunting Hour - Episode 4');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'The Haunting Hour - Episode 5', 'The final investigation reveals the asylum''s true purpose and demands a sacrifice to leave.', 'Horror', 'SERIES', '/series/the-haunting-hour---episode-5.jpg', '/series/the-haunting-hour---episode-5.mp4', 39, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'The Haunting Hour - Episode 5');

-- Action Movies
INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Iron Pursuit', 'A disgraced cop goes rogue to take down the arms dealer who framed him.', 'Action', 'MOVIE', '/movies/iron-pursuit.jpg', '/movies/iron-pursuit.mp4', 55, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Iron Pursuit');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Flash Point', 'An explosive expert must defuse a network of bombs planted across the city before the countdown ends.', 'Action', 'MOVIE', '/movies/flash-point.jpg', '/movies/flash-point.mp4', 50, 2024, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Flash Point');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Terminal Velocity', 'A stunt pilot is recruited for a covert mission that requires flying through impossible terrain.', 'Action', 'MOVIE', '/movies/terminal-velocity.jpg', '/movies/terminal-velocity.mp4', 58, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Terminal Velocity');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'The Enforcer', 'A retired bodyguard comes out of hiding when the family he once protected is targeted again.', 'Action', 'MOVIE', '/movies/the-enforcer.jpg', '/movies/the-enforcer.mp4', 52, 2024, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'The Enforcer');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Zero Hour', 'When a heist goes wrong, the crew has exactly one hour to escape the locked-down building.', 'Action', 'MOVIE', '/movies/zero-hour.jpg', '/movies/zero-hour.mp4', 48, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Zero Hour');

-- Action Series
INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Strike Force - Episode 1', 'An international task force is assembled to take down a global crime syndicate.', 'Action', 'SERIES', '/series/strike-force---episode-1.jpg', '/series/strike-force---episode-1.mp4', 36, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Strike Force - Episode 1');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Strike Force - Episode 2', 'The team''s first raid uncovers a weapons cache far larger than intelligence predicted.', 'Action', 'SERIES', '/series/strike-force---episode-2.jpg', '/series/strike-force---episode-2.mp4', 38, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Strike Force - Episode 2');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Strike Force - Episode 3', 'A double agent within the team leaks their next move, leading to an ambush.', 'Action', 'SERIES', '/series/strike-force---episode-3.jpg', '/series/strike-force---episode-3.mp4', 40, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Strike Force - Episode 3');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Strike Force - Episode 4', 'The team goes dark and operates off-grid to root out the mole.', 'Action', 'SERIES', '/series/strike-force---episode-4.jpg', '/series/strike-force---episode-4.mp4', 35, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Strike Force - Episode 4');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Strike Force - Episode 5', 'A high-speed chase across three countries leads to the syndicate''s financial hub.', 'Action', 'SERIES', '/series/strike-force---episode-5.jpg', '/series/strike-force---episode-5.mp4', 42, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Strike Force - Episode 5');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Strike Force - Episode 6', 'The team launches a coordinated assault on the syndicate''s island fortress.', 'Action', 'SERIES', '/series/strike-force---episode-6.jpg', '/series/strike-force---episode-6.mp4', 37, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Strike Force - Episode 6');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Strike Force - Episode 7', 'The final showdown forces the team leader to choose between the mission and saving a teammate.', 'Action', 'SERIES', '/series/strike-force---episode-7.jpg', '/series/strike-force---episode-7.mp4', 39, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Strike Force - Episode 7');

-- Documentary Movies
INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'The Ocean Within', 'A deep dive into the bioluminescent ecosystems thriving in the deepest ocean trenches.', 'Documentary', 'MOVIE', '/movies/the-ocean-within.jpg', '/movies/the-ocean-within.mp4', 70, 2024, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'The Ocean Within');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Rise of the Machines', 'How automation and AI are reshaping manufacturing and what it means for the global workforce.', 'Documentary', 'MOVIE', '/movies/rise-of-the-machines.jpg', '/movies/rise-of-the-machines.mp4', 65, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Rise of the Machines');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Into the Wild Blue', 'Following migratory birds across continents to understand how climate change alters ancient flight paths.', 'Documentary', 'MOVIE', '/movies/into-the-wild-blue.jpg', '/movies/into-the-wild-blue.mp4', 60, 2024, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Into the Wild Blue');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'The Human Code', 'Exploring the ethical dilemmas of genetic engineering through the eyes of scientists and patients.', 'Documentary', 'MOVIE', '/movies/the-human-code.jpg', '/movies/the-human-code.mp4', 68, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'The Human Code');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Earth Reimagined', 'Satellite imagery reveals how the planet has transformed over the last fifty years.', 'Documentary', 'MOVIE', '/movies/earth-reimagined.jpg', '/movies/earth-reimagined.mp4', 72, 2024, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Earth Reimagined');

INSERT INTO media (title, description, genre, type, thumbnail_url, video_url, duration_seconds, release_year, created_at)
SELECT 'Beyond the Stars', 'Astronomers from six countries collaborate to photograph a planet outside our solar system for the first time.', 'Documentary', 'MOVIE', '/movies/beyond-the-stars.jpg', '/movies/beyond-the-stars.mp4', 66, 2025, NOW()
WHERE NOT EXISTS (SELECT 1 FROM media WHERE title = 'Beyond the Stars');

UPDATE media SET video_url = REPLACE(video_url, '/videos/', '/movies/') WHERE type = 'MOVIE' AND video_url LIKE '/videos/%';
UPDATE media SET video_url = REPLACE(video_url, '/videos/', '/series/') WHERE type = 'SERIES' AND video_url LIKE '/videos/%';

UPDATE media SET thumbnail_url = REPLACE(REPLACE(video_url, '.mp4', '.jpg'), '.mkv', '.jpg') WHERE thumbnail_url IS NULL;

-- Admin account only (password: Password1!)
INSERT INTO users (email, password, display_name, full_name, phone, country, enabled, admin, subscription_type, created_at)
SELECT 'admin@example.com', '$2b$12$VwqWDzLp3Q29Ot9tiHnE7OoJ6ammqD2blykgR2GwhFGCQ4PSfX/.2', 'Admin', 'Admin User', '+1 5551234567', 'US', true, true, 'FREE', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@example.com');

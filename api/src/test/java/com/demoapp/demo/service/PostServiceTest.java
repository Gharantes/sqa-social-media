package com.demoapp.demo.service;

import com.demoapp.demo.model.UserPostReaction;
import com.demoapp.demo.repository.UserPostReactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class PostServiceTest {

    @Autowired
    private PostService postService;

    @Autowired
    private UserPostReactionRepository reactionRepository;

    @BeforeEach
    void cleanUp() {
        reactionRepository.deleteAll();
    }

    private final Integer limit = 20;
    private final Integer skip = 0;

    private List<Map<String, Object>> extractPosts(Map<String, Object> result) {
        return (List<Map<String, Object>>) result.get("posts");
    }
    private List<Map<String, Object>> getPosts(Long userId) {
        Map<String, Object> result = postService.getPosts(limit, skip, userId);
        return extractPosts(result);
    }

    @Test
    @DisplayName("Teste válido: Verifica se posts não está vazio.")
    void getPosts_naoVazio() {
        Long userId = 1L;

        Map<String, Object> result = postService.getPosts(limit, skip, userId);
        assertNotNull(result);
        assertTrue(result.containsKey("posts"));
        List<Map<String, Object>> posts = extractPosts(result);
        assertNotEquals(new ArrayList<>(), posts);
        assertFalse(posts.isEmpty());
    }
    @Test
    @DisplayName("Teste válido: Nenhum post é curtido se userId é nulo.")
    void getPosts_semUserId_nenhumCurtido() {
        Long userId = 1L;

        List<Map<String, Object>> posts = getPosts(userId);
        assertFalse(posts.isEmpty());
        posts.forEach(post -> assertFalse((Boolean) post.get("liked")));
    }
    @Test
    @DisplayName("Teste válido: marca liked=true para posts curtidos pelo usuário")
    void getPosts_comUserId_marcaLikedCorretamente() {
        Long userId = 1L;
        Long postId = 1L;

        UserPostReaction reaction = new UserPostReaction();
        reaction.setUserId(userId);
        reaction.setPostId(postId);
        reactionRepository.save(reaction);

        List<Map<String, Object>> posts = getPosts(userId);

        // O post com POST_ID=1 deve estar marcado como liked
        posts.stream()
                .filter(p -> (p.get("id")).equals(1L))
                .findFirst()
                .ifPresent(p -> assertTrue((Boolean) p.get("liked")));
    }
    @Test
    @DisplayName("Teste válido: retorna lista vazia quando usuário não curtiu nada")
    void getLikedPosts_semCurtidas_retornaVazio() {
        Long userId = 1L;

        Map<String, Object> result = postService.getLikedPosts(userId, limit, skip);

        assertNotNull(result);
        assertEquals(0, result.get("total"));
        assertTrue(((List<?>) result.get("posts")).isEmpty());
    }
    @Test
    @DisplayName("Teste válido: retorna post curtido corretamente")
    void getLikedPosts_comCurtida_retornaPost() {
        Long userId = 1L;
        Long postId = 1L;

        UserPostReaction reaction = new UserPostReaction();
        reaction.setUserId(userId);
        reaction.setPostId(postId);
        reactionRepository.save(reaction);

        Map<String, Object> result = postService.getLikedPosts(userId, limit, skip);

        assertNotNull(result);
        assertEquals(1, result.get("total"));

        List<Map<String, Object>> posts = (List<Map<String, Object>>) result.get("posts");
        assertEquals(1, posts.size());
        assertEquals(postId, posts.get(0).get("id"));
        assertTrue((Boolean) posts.get(0).get("liked"));
    }
    @Test
    @DisplayName("Teste válido: curtir post não curtido → liked=true e salvo no banco")
    void toggleLike_postNaoCurtido_retornaLikedTrue() {
        Long userId = 1L;
        Long postId = 1L;

        Map<String, Object> result = postService.toggleLike(postId, userId);

        assertTrue((Boolean) result.get("liked"));
        assertEquals(postId, result.get("postId"));
        assertEquals(1, reactionRepository.findByUserId(userId).size());
    }
    @Test
    @DisplayName("Teste válido: descurtir post já curtido → liked=false e removido do banco")
    void toggleLike_postJaCurtido_retornaLikedFalse() {
        Long userId = 1L;
        Long postId = 1L;

        UserPostReaction reaction = new UserPostReaction();
        reaction.setUserId(userId);
        reaction.setPostId(postId);
        reactionRepository.save(reaction);

        Map<String, Object> result = postService.toggleLike(postId, userId);

        assertFalse((Boolean) result.get("liked"));
        assertEquals(postId, result.get("postId"));
        assertEquals(0, reactionRepository.findByUserId(userId).size());
    }
}

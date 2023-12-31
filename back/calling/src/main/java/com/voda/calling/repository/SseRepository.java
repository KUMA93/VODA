package com.voda.calling.repository;

import com.voda.calling.model.dto.CallNotification;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;

public interface SseRepository{
    SseEmitter save(String emitterId, SseEmitter sseEmitter);

    void saveEventCache(String eventCacheId, CallNotification event);

    Map<String, SseEmitter> findAllEmitterStartWithByEmail(String email);

    Map<String, SseEmitter> findAllEmitterStartWithByEmailInList(List emails);

    Map<String, CallNotification> findAllEventCacheStartWithByEmail(String email);

    void deleteById(String id);

    void deleteAllEmitterStartWithEmail(String email);

    void deleteAllEventCacheStartWithId(String email);
}

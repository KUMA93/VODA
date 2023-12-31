package com.voda.calling.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CallNotification {

    private String eventName;
    private String receiverEmail;
    private String senderEmail;
    private String sessionId;
    private String token;
    private int callNo;
    private String content;
}

package com.arch.server.services.AuthServices;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtp(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Your verification code");
        message.setText(buildOtpMessage(otp));

        mailSender.send(message);
    }

    private String buildOtpMessage(String otp) {
        return """
            Your verification code is: %s

            This code expires in 5 minutes.
            If you did not request this, please ignore this email.
            """.formatted(otp);
    }
}

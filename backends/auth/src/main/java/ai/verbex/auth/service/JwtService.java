package ai.verbex.auth.service;

import ai.verbex.auth.dto.UserResponse;
import ai.verbex.auth.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.refreshSecret}")
    private String refreshSecret;

    @Value("${jwt.expiration}")
    private Long expirationMillis;

    @Value("${jwt.refreshExpiration}")
    private Long refreshExpirationMillis;

    private SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    private SecretKey getRefreshSecretKey() {
        return Keys.hmacShaKeyFor(refreshSecret.getBytes());
    }

    public Long getAccessTokenExpirationInSeconds() {
        return expirationMillis / 1000;
    }

    public Long getRefreshTokenExpirationInSeconds() {
        return refreshExpirationMillis / 1000;
    }

    public String generateAccessToken(User user) {
        return Jwts.builder()
                .subject(user.getEmail())
                .claim("userId", user.getId())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMillis))
                .signWith(getSecretKey())
                .compact();
    }

    public String generateRefreshToken(User user) {
        return Jwts.builder()
                .subject(user.getEmail())
                .claim("userId", user.getId())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + refreshExpirationMillis))
                .signWith(getRefreshSecretKey())
                .compact();
    }

    public UserResponse extractUserInfoFromAccessToken(String token) {
        Claims claims = extractAllClaims(token, getSecretKey());
        return new UserResponse(
                claims.get("userId", Long.class),
                claims.getSubject()
        );
    }

    public UserResponse extractUserInfoFromRefreshToken(String token) {
        Claims claims = extractAllClaims(token, getRefreshSecretKey());
        return new UserResponse(
                claims.get("userId", Long.class),
                claims.getSubject()
        );
    }

    private Claims extractAllClaims(String token, SecretKey key) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private Boolean isTokenExpired(String token, SecretKey key) {
        Claims claims = extractAllClaims(token, key);
        return claims.getExpiration().before(new Date());
    }

    public Boolean validateAccessToken(String token, UserDetails userDetails) {
        final String username = extractUserInfoFromAccessToken(token).email();
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token, getSecretKey()));
    }

    public Boolean validateRefreshToken(String token, UserDetails userDetails) {
        final String username = extractUserInfoFromRefreshToken(token).email();
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token, getRefreshSecretKey()));
    }
}

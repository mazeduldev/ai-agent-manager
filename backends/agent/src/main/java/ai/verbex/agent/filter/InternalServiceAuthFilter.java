package ai.verbex.agent.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class InternalServiceAuthFilter extends OncePerRequestFilter {

    @Value("${internal.api-key}")
    private String EXPECTED_API_KEY;
    private static final String INTERNAL_API_KEY_HEADER = "X-INTERNAL-API-KEY";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        if (request.getMethod().equals("GET") && request.getRequestURI().startsWith("/agents/")) {
            // Skip API key check if already authenticated (e.g., by JWT)
            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                String apiKey = request.getHeader(INTERNAL_API_KEY_HEADER);
                if (!EXPECTED_API_KEY.equals(apiKey)) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    return;
                }
            }
        }
        filterChain.doFilter(request, response);
    }

}

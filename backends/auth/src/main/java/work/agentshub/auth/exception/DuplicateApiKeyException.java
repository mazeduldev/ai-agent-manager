package work.agentshub.auth.exception;

public class DuplicateApiKeyException extends RuntimeException {
    public DuplicateApiKeyException() {
        super("API key for this user already exists, delete existing key before creating a new one");
    }
}

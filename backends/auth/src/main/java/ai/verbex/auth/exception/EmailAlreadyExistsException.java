package ai.verbex.auth.exception;

public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException() {
        super("User with this email already exists");
    }
    public EmailAlreadyExistsException(String message) {
        super(message);
    }
}

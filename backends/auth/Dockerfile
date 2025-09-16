# Use a base image with Maven and JDK
FROM maven:3.9-eclipse-temurin-17 AS development

WORKDIR /app

# Copy the Maven wrapper and pom.xml
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Download dependencies to leverage Docker cache
RUN ./mvnw dependency:go-offline

# Copy the rest of your application's source code
COPY src ./src

# Expose the application port
EXPOSE 8080

# Command to run the app in development mode with debugging enabled
# This command will automatically recompile and reload on file changes.
CMD ["./mvnw", "spring-boot:run", "-Dspring-boot.run.jvmArguments=-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005"]
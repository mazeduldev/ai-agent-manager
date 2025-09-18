const fs = require("node:fs");
const path = require("node:path");

// --- Configuration ---

// An array of all .env files that need to be processed.
const ENV_FILES = [
  "backends/agent/.env",
  "backends/auth/.env",
  "backends/chat/.env",
  "frontends/chatbox/.env",
  "frontends/dashboard/.env",
];

// A map of backend services. The script will swap between the 'local'
// and 'docker' hostnames based on the mode.
// IMPORTANT: Adjust these to match your docker-compose.yml service names and ports.
const SERVICE_MAP = [
  { local: "localhost:8080", docker: "auth-server:8080" },
  { local: "localhost:8100", docker: "agent-server:8100" },
  { local: "localhost:8200", docker: "chat-server:8200" },
];

// --- Script Logic ---

const mode = process.argv[2];

if (mode !== "local" && mode !== "docker") {
  console.error("Usage: node env-switcher.js [local|docker]");
  console.error(
    "  local:  Configures .env files for running services on the host."
  );
  console.error(
    "  docker: Configures .env files for running services in Docker."
  );
  process.exit(1);
}

console.log(`Switching environment to '${mode}' mode...`);

for (const filePath of ENV_FILES) {
  const fullPath = path.join(__dirname, "..", filePath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`- Warning: ${filePath} not found. Skipping.`);
    continue;
  }

  console.log(`- Processing ${filePath}...`);
  const content = fs.readFileSync(fullPath, "utf8");
  const lines = content.split("\n");

  const newLines = lines.map((line) => {
    const parts = line.split("=");
    if (parts.length < 2) {
      return line; // Not a variable assignment, skip.
    }

    const key = parts[0];
    let value = parts.slice(1).join("=");

    if (key.startsWith("NEXT_PUBLIC_")) {
      // Rule: NEXT_PUBLIC_ variables should always use localhost.
      // We achieve this by replacing any docker host with its local equivalent.
      for (const service of SERVICE_MAP) {
        value = value.replace(service.docker, service.local);
      }
    } else {
      // Rule: For all other variables, switch based on the mode.
      if (mode === "docker") {
        for (const service of SERVICE_MAP) {
          value = value.replace(service.local, service.docker);
        }
      } else { // mode === 'local'
        for (const service of SERVICE_MAP) {
          value = value.replace(service.docker, service.local);
        }
      }
    }
    return `${key}=${value}`;
  });

  fs.writeFileSync(fullPath, newLines.join("\n"));
}

console.log("Environment switch complete.");

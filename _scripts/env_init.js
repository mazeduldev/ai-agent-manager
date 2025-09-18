const fs = require("node:fs");
const path = require("node:path");

// --- Configuration ---
// Add all directories that should have a .env file.
const PROJECT_DIRS = [
  "..",
  "../backends/agent",
  "../backends/auth",
  "../backends/chat",
  "../frontends/chatbox",
  "../frontends/dashboard",
];

console.log("Initializing .env files from .env.example...");

// biome-ignore lint/complexity/noForEach: <explanation>
PROJECT_DIRS.forEach((dir) => {
  const fullDirPath = path.join(__dirname, dir);
  const examplePath = path.join(fullDirPath, ".env.example");
  const envPath = path.join(fullDirPath, ".env");

  if (!fs.existsSync(examplePath)) {
    console.warn(`- Warning: ${dir}/.env.example not found. Skipping.`);
    return;
  }

  if (fs.existsSync(envPath)) {
    console.log(`- Info: ${dir}/.env already exists. Skipping.`);
  } else {
    try {
      fs.copyFileSync(examplePath, envPath);
      console.log(`- Success: Created ${dir}/.env.`);
    } catch (error) {
      console.error(`- Error: Failed to create ${dir}/.env.`, error);
    }
  }
});

console.log("\nEnvironment initialization complete.");
console.log("Run 'node ./_scripts/env_switcher local' or 'node ./_scripts/env_switcher local' to configure for your setup.");
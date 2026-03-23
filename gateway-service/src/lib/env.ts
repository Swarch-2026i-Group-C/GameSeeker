/**
 * Typed, validated environment configuration.
 * Throws at startup if a required variable is missing, so misconfiguration
 * surfaces immediately rather than at the first proxied request.
 */

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  PORT: parseInt(process.env["PORT"] ?? "8080", 10),
  USER_SERVICE_URL: requireEnv("USER_SERVICE_URL"),
  SCRAPPER_SERVICE_URL: requireEnv("SCRAPPER_SERVICE_URL"),
} as const;

export type Env = typeof env;

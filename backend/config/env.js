const MIN_JWT_SECRET_LENGTH = 32;

function requireEnv(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required. Set it in backend/.env before starting the server.`);
  }

  return value;
}

export function validateEnv() {
  const jwtSecret = requireEnv("JWT_SECRET");

  if (jwtSecret.length < MIN_JWT_SECRET_LENGTH) {
    throw new Error(
      `JWT_SECRET must be at least ${MIN_JWT_SECRET_LENGTH} characters long. Generate a strong random secret and restart the server.`,
    );
  }

  requireEnv("MONGO_URI");
  requireEnv("ADMIN_ID");
  requireEnv("ADMIN_PASSWORD");
  requireEnv("CLOUDINARY_CLOUD_NAME");
  requireEnv("CLOUDINARY_API_KEY");
  requireEnv("CLOUDINARY_API_SECRET");
}

export function getJwtSecret() {
  return requireEnv("JWT_SECRET");
}

export function getAdminSeedConfig() {
  return {
    username: requireEnv("ADMIN_ID"),
    password: requireEnv("ADMIN_PASSWORD"),
  };
}

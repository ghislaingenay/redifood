export function verifyKeys() {
  if (!process.env.JWT_TOKEN) {
    throw new Error('JWT_TOKEN must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  if (!process.env.POSTGRES_USER) {
    throw new Error('POSTGRES_USER must be defined');
  }

  if (!process.env.POSTGRES_HOST) {
    throw new Error('POSTGRES_HOST must be defined');
  }

  if (!process.env.POSTGRES_DB_NAME) {
    throw new Error('POSTGRES_DB_NAME must be defined');
  }

  if (!process.env.POSTGRES_PASSWORD) {
    throw new Error('POSTGRES_PASSWORD must be defined');
  }

  if (!process.env.POSTGRES_PORT) {
    throw new Error('POSTGRES_PORT must be defined');
  }
}

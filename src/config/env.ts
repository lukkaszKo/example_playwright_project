import 'dotenv/config';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  baseUrl: requireEnv('BASE_URL'),
  userOne: {
    email: requireEnv('EMAIL_USER_ONE'),
    password: requireEnv('PASSWORD_USER_ONE'),
  },
  userTwo: {
    email: requireEnv('EMAIL_USER_TWO'),
    password: requireEnv('PASSWORD_USER_TWO'),
  },
};

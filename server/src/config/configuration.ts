import { durationToSeconds } from '../common/utils/duration.util';

export interface AppConfig {
  isProduction: boolean;
  port: number;
  mongodbUri: string;
  corsOrigins: string[];
  jwt: {
    secret: string;
    expiresInSeconds: number;
  };
}

export const configuration = (): AppConfig => ({
  isProduction: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT),
  mongodbUri: process.env.MONGODB_URI as string,
  corsOrigins: (process.env.CORS_ORIGIN as string)
    .split(',')
    .map((origin) => origin.trim()),
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresInSeconds: durationToSeconds(process.env.JWT_EXPIRES_IN as string),
  },
});

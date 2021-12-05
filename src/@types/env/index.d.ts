/* eslint-disable @typescript-eslint/naming-convention */
declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    APP_API_URL: string;
    FORGOT_MAIL_URL: string;
    CLOUDFLARE_SUPPORT: string;

    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_REGION: string;

    S3_BUCKET: string;
    S3_BUCKET_REGION: string;
    S3_BUCKET_URL: string;
    S3_ENDPOINT: string;

    MAIL_ADDRESS: string;
    MAIL_PROVIDER: "S3" | "ETHEREAL";

    STORAGE_TYPE: "S3_COMPATIBLE" | "LOCAL";

    REDIS_URL: string;
    DATABASE_URL: string;

    SENTRY_DSN: string;
  }
}

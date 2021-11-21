/* eslint-disable @typescript-eslint/naming-convention */
declare namespace NodeJS {
  interface ProcessEnv {
    FORGOT_MAIL_URL: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_S3_BUCKET: string;
    AWS_BUCKET_REGION: string;
    AWS_BUCKET_URL: string;
    APP_API_URL: string;
    STORAGE_TYPE: "S3" | "LOCAL";
  }
}

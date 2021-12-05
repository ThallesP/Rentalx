import { Expose } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";

@Entity("users")
export class User {
  @PrimaryColumn()
  readonly id?: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  driver_license: string;

  @Column()
  is_admin: boolean;

  @Column()
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @Expose({ name: "avatar_url" })
  avatar_url(): string {
    switch (process.env.STORAGE_TYPE) {
      case "S3_COMPATIBLE":
        return `${process.env.S3_BUCKET_URL}/avatars/${this.avatar}`;

      case "LOCAL":
        return `${process.env.APP_API_URL}/avatars/${this.avatar}`;

      default:
        return null;
    }
  }

  constructor() {
    if (!this.id) this.id = uuidV4();
  }
}

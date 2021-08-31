import { v4 as uuidV4 } from "uuid";

export class Category {
  readonly id?: string;
  name: string;
  description: string;
  created_at: Date;

  constructor() {
    if (!this.id) this.id = uuidV4();
  }
}

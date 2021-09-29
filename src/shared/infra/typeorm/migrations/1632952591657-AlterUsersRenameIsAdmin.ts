import { MigrationInterface, QueryRunner } from "typeorm";

// I had to rename this to follow SQL column pattern and to avoid errors in the future
export class AlterUsersRenameIsAdmin1632952591657
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn("users", "isAdmin", "is_admin");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn("users", "is_admin", "isAdmin");
  }
}

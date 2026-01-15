import { Migration } from '@mikro-orm/migrations';

export class Migration20260115021234 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`custom_base_entity\` (\`id\` integer not null primary key autoincrement, \`created_at\` datetime null, \`updated_at\` datetime null);`);

    this.addSql(`create table \`user\` (\`id\` integer not null primary key autoincrement, \`created_at\` datetime null, \`updated_at\` datetime null, \`first_name\` text not null, \`last_name\` text not null);`);
  }

}

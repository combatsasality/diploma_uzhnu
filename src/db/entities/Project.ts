import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Project {
  @PrimaryKey({ type: "number" })
  id!: number;

  @Property({ type: "string" })
  name!: string;

  @Property({ type: "Date", onCreate: () => new Date() })
  createdAt: Date = new Date();
}

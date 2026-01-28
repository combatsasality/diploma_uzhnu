PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_projectFile` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	`projectId` text NOT NULL,
	`absolutePath` text NOT NULL,
	`filename` text NOT NULL,
	`mimeType` text NOT NULL,
	`size` integer NOT NULL,
	FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_projectFile`("id", "createdAt", "updatedAt", "projectId", "absolutePath", "filename", "mimeType", "size") SELECT "id", "createdAt", "updatedAt", "projectId", "absolutePath", "filename", "mimeType", "size" FROM `projectFile`;--> statement-breakpoint
DROP TABLE `projectFile`;--> statement-breakpoint
ALTER TABLE `__new_projectFile` RENAME TO `projectFile`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `project_file_project_id_idx` ON `projectFile` (`projectId`);
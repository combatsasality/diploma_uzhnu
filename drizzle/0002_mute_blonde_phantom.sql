CREATE TABLE `projectFile` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	`projectId` text NOT NULL,
	`absolutePath` text NOT NULL,
	`filename` text,
	`mimeType` text,
	`size` integer,
	FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `project_file_project_id_idx` ON `projectFile` (`projectId`);
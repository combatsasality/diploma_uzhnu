CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL
);

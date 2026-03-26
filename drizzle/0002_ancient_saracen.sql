CREATE TABLE `athlete_headshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`photoUrl` text NOT NULL,
	`isVerified` boolean DEFAULT false,
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	`verifiedAt` timestamp,
	CONSTRAINT `athlete_headshots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `check_in_permissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tournamentId` int NOT NULL,
	`userId` int NOT NULL,
	`permissionType` enum('facial_recognition_checkin','score_entry','full_admin') DEFAULT 'facial_recognition_checkin',
	`grantedBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`revokedAt` timestamp,
	CONSTRAINT `check_in_permissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `facial_recognition_checkins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tournamentId` int NOT NULL,
	`athleteId` int NOT NULL,
	`hostId` int NOT NULL,
	`matchConfidence` decimal(3,2) NOT NULL,
	`verificationStatus` enum('confirmed','unrecognized','manual_verified') DEFAULT 'confirmed',
	`checkInMode` enum('player_by_player','group_photo') NOT NULL,
	`checkedInAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `facial_recognition_checkins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `player_stats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`teamId` int NOT NULL,
	`tournamentId` int NOT NULL,
	`gameId` int,
	`position` varchar(50) NOT NULL,
	`passingYards` int DEFAULT 0,
	`passingTouchdowns` int DEFAULT 0,
	`interceptions` int DEFAULT 0,
	`completions` int DEFAULT 0,
	`attempts` int DEFAULT 0,
	`receptions` int DEFAULT 0,
	`receivingYards` int DEFAULT 0,
	`receivingTouchdowns` int DEFAULT 0,
	`tackles` int DEFAULT 0,
	`passBreakups` int DEFAULT 0,
	`defensiveInterceptions` int DEFAULT 0,
	`pointsScored` int DEFAULT 0,
	`pointsAllowed` int DEFAULT 0,
	`enteredBy` int NOT NULL,
	`verifiedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `player_stats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stat_leaderboards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`position` varchar(50) NOT NULL,
	`season` varchar(20) NOT NULL,
	`graduationYear` int,
	`state` varchar(50),
	`statType` varchar(50) NOT NULL,
	`statValue` int DEFAULT 0,
	`rank` int,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stat_leaderboards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `team_logos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`teamId` int NOT NULL,
	`logoUrl` text NOT NULL,
	`source` varchar(50) DEFAULT 'auto_detected',
	`confidence` decimal(3,2) DEFAULT '1.00',
	`detectedAt` timestamp DEFAULT (now()),
	CONSTRAINT `team_logos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `team_member_invitations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tournamentId` int NOT NULL,
	`inviterId` int NOT NULL,
	`inviteeId` int NOT NULL,
	`status` enum('pending','accepted','declined','revoked') DEFAULT 'pending',
	`permissionType` enum('facial_recognition_checkin','score_entry','full_admin') DEFAULT 'facial_recognition_checkin',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`acceptedAt` timestamp,
	`revokedAt` timestamp,
	CONSTRAINT `team_member_invitations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tournament_requirements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tournamentId` int NOT NULL,
	`minGraduationYear` int,
	`maxGraduationYear` int,
	`minAge` int,
	`maxAge` int,
	`maxRosterSize` int,
	`requiresPassport` boolean DEFAULT true,
	`customRequirements` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tournament_requirements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tournament_waivers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tournamentId` int NOT NULL,
	`title` varchar(200) NOT NULL,
	`fileUrl` text NOT NULL,
	`isRequired` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tournament_waivers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `waiver_signatures` (
	`id` int AUTO_INCREMENT NOT NULL,
	`waiverId` int NOT NULL,
	`userId` int NOT NULL,
	`teamId` int NOT NULL,
	`signedAt` timestamp DEFAULT (now()),
	CONSTRAINT `waiver_signatures_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `zorts_tournaments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`externalId` varchar(100),
	`name` varchar(300) NOT NULL,
	`hostOrganization` varchar(200),
	`location` varchar(300),
	`city` varchar(100),
	`state` varchar(50),
	`startDate` timestamp,
	`endDate` timestamp,
	`status` enum('upcoming','in_progress','completed') DEFAULT 'upcoming',
	`participatingTeams` int DEFAULT 0,
	`bracketData` text,
	`resultsData` text,
	`source` varchar(50) DEFAULT 'zorts',
	`syncedAt` timestamp DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `zorts_tournaments_id` PRIMARY KEY(`id`),
	CONSTRAINT `zorts_tournaments_externalId_unique` UNIQUE(`externalId`)
);
--> statement-breakpoint
ALTER TABLE `athlete_profiles` ADD `instagramHandle` varchar(100);--> statement-breakpoint
ALTER TABLE `athlete_profiles` ADD `twitterHandle` varchar(100);--> statement-breakpoint
ALTER TABLE `athlete_profiles` ADD `tiktokHandle` varchar(100);--> statement-breakpoint
ALTER TABLE `athlete_profiles` ADD `youtubeChannel` varchar(100);
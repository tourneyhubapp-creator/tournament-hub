CREATE TABLE `athlete_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`position` varchar(50),
	`height` varchar(20),
	`weight` int,
	`graduationYear` int,
	`school` varchar(200),
	`gpa` decimal(3,2),
	`fortyYardDash` decimal(4,2),
	`verticalJump` decimal(4,1),
	`benchPress` int,
	`shuttle` decimal(4,2),
	`hudlUrl` text,
	`highlightUrl` text,
	`passingYards` int DEFAULT 0,
	`touchdowns` int DEFAULT 0,
	`receptions` int DEFAULT 0,
	`interceptions` int DEFAULT 0,
	`exposureScore` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `athlete_profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `brackets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tournamentId` int NOT NULL,
	`divisionId` int,
	`size` int NOT NULL,
	`generatedAt` timestamp NOT NULL DEFAULT (now()),
	`isManualOverride` boolean DEFAULT false,
	CONSTRAINT `brackets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `followers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`followerId` int NOT NULL,
	`followingId` int NOT NULL,
	`followType` enum('user','team') NOT NULL DEFAULT 'user',
	`teamId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `followers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `games` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tournamentId` int NOT NULL,
	`poolId` int,
	`bracketRound` int,
	`bracketPosition` int,
	`homeTeamId` int NOT NULL,
	`awayTeamId` int NOT NULL,
	`homeScore` int,
	`awayScore` int,
	`field` varchar(50),
	`scheduledAt` timestamp,
	`completedAt` timestamp,
	`status` enum('scheduled','in_progress','completed','cancelled') NOT NULL DEFAULT 'scheduled',
	`gameType` enum('pool','bracket') NOT NULL DEFAULT 'pool',
	`winnerId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `games_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`senderId` int NOT NULL,
	`receiverId` int NOT NULL,
	`content` text NOT NULL,
	`isRead` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('follow','message','ranking_update','tournament_invite','passport_approved','passport_rejected','score_update') NOT NULL,
	`title` varchar(200) NOT NULL,
	`body` text,
	`isRead` boolean DEFAULT false,
	`relatedId` int,
	`relatedType` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `passport_documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`passportId` int NOT NULL,
	`userId` int NOT NULL,
	`docType` enum('birth_certificate','state_id','report_card','headshot') NOT NULL,
	`fileUrl` text NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `passport_documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('passport','tournament_entry','refund') NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`platformFee` decimal(10,2) DEFAULT '0',
	`hostAmount` decimal(10,2) DEFAULT '0',
	`currency` varchar(3) NOT NULL DEFAULT 'USD',
	`status` enum('pending','completed','failed','refunded','frozen') NOT NULL DEFAULT 'pending',
	`paymentMethod` enum('card','apple_pay','venmo','cash_app') NOT NULL,
	`stripePaymentIntentId` varchar(255),
	`tournamentId` int,
	`teamId` int,
	`hostId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `platform_config` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`value` text NOT NULL,
	`description` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `platform_config_id` PRIMARY KEY(`id`),
	CONSTRAINT `platform_config_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `player_passports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`playerId` varchar(20),
	`status` enum('pending','approved','rejected','expired') NOT NULL DEFAULT 'pending',
	`purchasedAt` timestamp NOT NULL DEFAULT (now()),
	`approvedAt` timestamp,
	`expiresAt` timestamp,
	`rejectionReason` text,
	`qrCode` text,
	`dateOfBirth` varchar(20),
	`graduationYear` int,
	`teamName` varchar(200),
	`photoUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `player_passports_id` PRIMARY KEY(`id`),
	CONSTRAINT `player_passports_playerId_unique` UNIQUE(`playerId`)
);
--> statement-breakpoint
CREATE TABLE `pools` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tournamentId` int NOT NULL,
	`divisionId` int,
	`name` varchar(50) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pools_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `post_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`userId` int NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `post_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `post_likes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `post_likes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`caption` text,
	`mediaUrl` text,
	`mediaType` enum('video','photo') NOT NULL,
	`thumbnailUrl` text,
	`likes` int DEFAULT 0,
	`views` int DEFAULT 0,
	`shares` int DEFAULT 0,
	`isTopPlay` boolean DEFAULT false,
	`isFlagged` boolean DEFAULT false,
	`status` enum('active','removed','under_review') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rankings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`teamId` int NOT NULL,
	`season` varchar(20) NOT NULL,
	`ageGroup` varchar(30),
	`state` varchar(50),
	`nationalRank` int,
	`stateRank` int,
	`totalPoints` int DEFAULT 0,
	`winPercentage` decimal(5,2),
	`strengthOfSchedule` decimal(5,2),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rankings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `receipts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`paymentId` int NOT NULL,
	`userId` int NOT NULL,
	`transactionId` varchar(100) NOT NULL,
	`teamName` varchar(200),
	`tournamentName` varchar(300),
	`totalPaid` decimal(10,2) NOT NULL,
	`hostAmount` decimal(10,2),
	`platformFee` decimal(10,2),
	`paymentMethod` varchar(50),
	`emailedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `receipts_id` PRIMARY KEY(`id`),
	CONSTRAINT `receipts_transactionId_unique` UNIQUE(`transactionId`)
);
--> statement-breakpoint
CREATE TABLE `team_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`teamId` int NOT NULL,
	`userId` int NOT NULL,
	`role` enum('player','coach','manager') NOT NULL DEFAULT 'player',
	`jerseyNumber` int,
	`position` varchar(50),
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `team_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`ownerId` int NOT NULL,
	`logoUrl` text,
	`city` varchar(100),
	`state` varchar(50),
	`ageGroup` varchar(20),
	`division` varchar(50),
	`rankingPoints` int DEFAULT 0,
	`nationalRank` int,
	`stateRank` int,
	`wins` int DEFAULT 0,
	`losses` int DEFAULT 0,
	`pointsScored` int DEFAULT 0,
	`pointsAllowed` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `teams_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `teams_in_tournament` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tournamentId` int NOT NULL,
	`divisionId` int,
	`teamId` int NOT NULL,
	`registeredBy` int NOT NULL,
	`paymentStatus` enum('pending','paid','refunded','failed') NOT NULL DEFAULT 'pending',
	`paymentId` int,
	`seed` int,
	`poolWins` int DEFAULT 0,
	`poolLosses` int DEFAULT 0,
	`poolPointsScored` int DEFAULT 0,
	`poolPointsAllowed` int DEFAULT 0,
	`registeredAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `teams_in_tournament_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tournament_divisions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tournamentId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`ageGroup` varchar(30),
	`maxTeams` int,
	`entryFee` decimal(10,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tournament_divisions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tournaments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`hostId` int NOT NULL,
	`name` varchar(300) NOT NULL,
	`location` varchar(300),
	`city` varchar(100),
	`state` varchar(50),
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`maxTeams` int NOT NULL,
	`fieldsCount` int DEFAULT 1,
	`status` enum('draft','open','in_progress','completed','cancelled') NOT NULL DEFAULT 'draft',
	`earlyBirdFee` decimal(10,2),
	`standardFee` decimal(10,2) NOT NULL,
	`lateFee` decimal(10,2),
	`earlyBirdDeadline` timestamp,
	`lateDeadline` timestamp,
	`description` text,
	`bannerUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tournaments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('athlete','host','admin') NOT NULL DEFAULT 'athlete';--> statement-breakpoint
ALTER TABLE `users` ADD `avatarUrl` text;--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `city` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `state` varchar(50);
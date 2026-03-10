import {
  boolean,
  decimal,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

// ─────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["athlete", "host", "admin"]).default("athlete").notNull(),
  avatarUrl: text("avatarUrl"),
  bio: text("bio"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// ATHLETE PROFILES
// ─────────────────────────────────────────────
export const athleteProfiles = mysqlTable("athlete_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  position: varchar("position", { length: 50 }),
  height: varchar("height", { length: 20 }),
  weight: int("weight"),
  graduationYear: int("graduationYear"),
  school: varchar("school", { length: 200 }),
  gpa: decimal("gpa", { precision: 3, scale: 2 }),
  fortyYardDash: decimal("fortyYardDash", { precision: 4, scale: 2 }),
  verticalJump: decimal("verticalJump", { precision: 4, scale: 1 }),
  benchPress: int("benchPress"),
  shuttle: decimal("shuttle", { precision: 4, scale: 2 }),
  hudlUrl: text("hudlUrl"),
  highlightUrl: text("highlightUrl"),
  passingYards: int("passingYards").default(0),
  touchdowns: int("touchdowns").default(0),
  receptions: int("receptions").default(0),
  interceptions: int("interceptions").default(0),
  exposureScore: int("exposureScore").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─────────────────────────────────────────────
// PLAYER PASSPORTS
// ─────────────────────────────────────────────
export const playerPassports = mysqlTable("player_passports", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  playerId: varchar("playerId", { length: 20 }).unique(),
  status: mysqlEnum("status", ["pending", "approved", "rejected", "expired"]).default("pending").notNull(),
  purchasedAt: timestamp("purchasedAt").defaultNow().notNull(),
  approvedAt: timestamp("approvedAt"),
  expiresAt: timestamp("expiresAt"),
  rejectionReason: text("rejectionReason"),
  qrCode: text("qrCode"),
  dateOfBirth: varchar("dateOfBirth", { length: 20 }),
  graduationYear: int("graduationYear"),
  teamName: varchar("teamName", { length: 200 }),
  photoUrl: text("photoUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─────────────────────────────────────────────
// PASSPORT DOCUMENTS
// ─────────────────────────────────────────────
export const passportDocuments = mysqlTable("passport_documents", {
  id: int("id").autoincrement().primaryKey(),
  passportId: int("passportId").notNull(),
  userId: int("userId").notNull(),
  docType: mysqlEnum("docType", ["birth_certificate", "state_id", "report_card", "headshot"]).notNull(),
  fileUrl: text("fileUrl").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// TEAMS
// ─────────────────────────────────────────────
export const teams = mysqlTable("teams", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  ownerId: int("ownerId").notNull(),
  logoUrl: text("logoUrl"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  ageGroup: varchar("ageGroup", { length: 20 }),
  division: varchar("division", { length: 50 }),
  rankingPoints: int("rankingPoints").default(0),
  nationalRank: int("nationalRank"),
  stateRank: int("stateRank"),
  wins: int("wins").default(0),
  losses: int("losses").default(0),
  pointsScored: int("pointsScored").default(0),
  pointsAllowed: int("pointsAllowed").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─────────────────────────────────────────────
// TEAM MEMBERS
// ─────────────────────────────────────────────
export const teamMembers = mysqlTable("team_members", {
  id: int("id").autoincrement().primaryKey(),
  teamId: int("teamId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["player", "coach", "manager"]).default("player").notNull(),
  jerseyNumber: int("jerseyNumber"),
  position: varchar("position", { length: 50 }),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// TOURNAMENTS
// ─────────────────────────────────────────────
export const tournaments = mysqlTable("tournaments", {
  id: int("id").autoincrement().primaryKey(),
  hostId: int("hostId").notNull(),
  name: varchar("name", { length: 300 }).notNull(),
  location: varchar("location", { length: 300 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  maxTeams: int("maxTeams").notNull(),
  fieldsCount: int("fieldsCount").default(1),
  status: mysqlEnum("status", ["draft", "open", "in_progress", "completed", "cancelled"]).default("draft").notNull(),
  earlyBirdFee: decimal("earlyBirdFee", { precision: 10, scale: 2 }),
  standardFee: decimal("standardFee", { precision: 10, scale: 2 }).notNull(),
  lateFee: decimal("lateFee", { precision: 10, scale: 2 }),
  earlyBirdDeadline: timestamp("earlyBirdDeadline"),
  lateDeadline: timestamp("lateDeadline"),
  description: text("description"),
  bannerUrl: text("bannerUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─────────────────────────────────────────────
// TOURNAMENT DIVISIONS
// ─────────────────────────────────────────────
export const tournamentDivisions = mysqlTable("tournament_divisions", {
  id: int("id").autoincrement().primaryKey(),
  tournamentId: int("tournamentId").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  ageGroup: varchar("ageGroup", { length: 30 }),
  maxTeams: int("maxTeams"),
  entryFee: decimal("entryFee", { precision: 10, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// TEAMS IN TOURNAMENT (Registrations)
// ─────────────────────────────────────────────
export const teamsInTournament = mysqlTable("teams_in_tournament", {
  id: int("id").autoincrement().primaryKey(),
  tournamentId: int("tournamentId").notNull(),
  divisionId: int("divisionId"),
  teamId: int("teamId").notNull(),
  registeredBy: int("registeredBy").notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "refunded", "failed"]).default("pending").notNull(),
  paymentId: int("paymentId"),
  seed: int("seed"),
  poolWins: int("poolWins").default(0),
  poolLosses: int("poolLosses").default(0),
  poolPointsScored: int("poolPointsScored").default(0),
  poolPointsAllowed: int("poolPointsAllowed").default(0),
  registeredAt: timestamp("registeredAt").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// POOLS
// ─────────────────────────────────────────────
export const pools = mysqlTable("pools", {
  id: int("id").autoincrement().primaryKey(),
  tournamentId: int("tournamentId").notNull(),
  divisionId: int("divisionId"),
  name: varchar("name", { length: 50 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// GAMES
// ─────────────────────────────────────────────
export const games = mysqlTable("games", {
  id: int("id").autoincrement().primaryKey(),
  tournamentId: int("tournamentId").notNull(),
  poolId: int("poolId"),
  bracketRound: int("bracketRound"),
  bracketPosition: int("bracketPosition"),
  homeTeamId: int("homeTeamId").notNull(),
  awayTeamId: int("awayTeamId").notNull(),
  homeScore: int("homeScore"),
  awayScore: int("awayScore"),
  field: varchar("field", { length: 50 }),
  scheduledAt: timestamp("scheduledAt"),
  completedAt: timestamp("completedAt"),
  status: mysqlEnum("status", ["scheduled", "in_progress", "completed", "cancelled"]).default("scheduled").notNull(),
  gameType: mysqlEnum("gameType", ["pool", "bracket"]).default("pool").notNull(),
  winnerId: int("winnerId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─────────────────────────────────────────────
// BRACKETS
// ─────────────────────────────────────────────
export const brackets = mysqlTable("brackets", {
  id: int("id").autoincrement().primaryKey(),
  tournamentId: int("tournamentId").notNull(),
  divisionId: int("divisionId"),
  size: int("size").notNull(),
  generatedAt: timestamp("generatedAt").defaultNow().notNull(),
  isManualOverride: boolean("isManualOverride").default(false),
});

// ─────────────────────────────────────────────
// RANKINGS
// ─────────────────────────────────────────────
export const rankings = mysqlTable("rankings", {
  id: int("id").autoincrement().primaryKey(),
  teamId: int("teamId").notNull(),
  season: varchar("season", { length: 20 }).notNull(),
  ageGroup: varchar("ageGroup", { length: 30 }),
  state: varchar("state", { length: 50 }),
  nationalRank: int("nationalRank"),
  stateRank: int("stateRank"),
  totalPoints: int("totalPoints").default(0),
  winPercentage: decimal("winPercentage", { precision: 5, scale: 2 }),
  strengthOfSchedule: decimal("strengthOfSchedule", { precision: 5, scale: 2 }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─────────────────────────────────────────────
// PAYMENTS
// ─────────────────────────────────────────────
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["passport", "tournament_entry", "refund"]).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal("platformFee", { precision: 10, scale: 2 }).default("0"),
  hostAmount: decimal("hostAmount", { precision: 10, scale: 2 }).default("0"),
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded", "frozen"]).default("pending").notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["card", "apple_pay", "venmo", "cash_app"]).notNull(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  tournamentId: int("tournamentId"),
  teamId: int("teamId"),
  hostId: int("hostId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─────────────────────────────────────────────
// RECEIPTS
// ─────────────────────────────────────────────
export const receipts = mysqlTable("receipts", {
  id: int("id").autoincrement().primaryKey(),
  paymentId: int("paymentId").notNull(),
  userId: int("userId").notNull(),
  transactionId: varchar("transactionId", { length: 100 }).notNull().unique(),
  teamName: varchar("teamName", { length: 200 }),
  tournamentName: varchar("tournamentName", { length: 300 }),
  totalPaid: decimal("totalPaid", { precision: 10, scale: 2 }).notNull(),
  hostAmount: decimal("hostAmount", { precision: 10, scale: 2 }),
  platformFee: decimal("platformFee", { precision: 10, scale: 2 }),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  emailedAt: timestamp("emailedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// PLATFORM CONFIG
// ─────────────────────────────────────────────
export const platformConfig = mysqlTable("platform_config", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─────────────────────────────────────────────
// POSTS (Social Feed)
// ─────────────────────────────────────────────
export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  caption: text("caption"),
  mediaUrl: text("mediaUrl"),
  mediaType: mysqlEnum("mediaType", ["video", "photo"]).notNull(),
  thumbnailUrl: text("thumbnailUrl"),
  likes: int("likes").default(0),
  views: int("views").default(0),
  shares: int("shares").default(0),
  isTopPlay: boolean("isTopPlay").default(false),
  isFlagged: boolean("isFlagged").default(false),
  status: mysqlEnum("status", ["active", "removed", "under_review"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─────────────────────────────────────────────
// POST COMMENTS
// ─────────────────────────────────────────────
export const postComments = mysqlTable("post_comments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  userId: int("userId").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// POST LIKES
// ─────────────────────────────────────────────
export const postLikes = mysqlTable("post_likes", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// MESSAGES
// ─────────────────────────────────────────────
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  senderId: int("senderId").notNull(),
  receiverId: int("receiverId").notNull(),
  content: text("content").notNull(),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// FOLLOWERS
// ─────────────────────────────────────────────
export const followers = mysqlTable("followers", {
  id: int("id").autoincrement().primaryKey(),
  followerId: int("followerId").notNull(),
  followingId: int("followingId").notNull(),
  followType: mysqlEnum("followType", ["user", "team"]).default("user").notNull(),
  teamId: int("teamId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["follow", "message", "ranking_update", "tournament_invite", "passport_approved", "passport_rejected", "score_update"]).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  body: text("body"),
  isRead: boolean("isRead").default(false),
  relatedId: int("relatedId"),
  relatedType: varchar("relatedType", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// EXPORTED TYPES
// ─────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type AthleteProfile = typeof athleteProfiles.$inferSelect;
export type InsertAthleteProfile = typeof athleteProfiles.$inferInsert;
export type PlayerPassport = typeof playerPassports.$inferSelect;
export type InsertPlayerPassport = typeof playerPassports.$inferInsert;
export type PassportDocument = typeof passportDocuments.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type InsertTeam = typeof teams.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type Tournament = typeof tournaments.$inferSelect;
export type InsertTournament = typeof tournaments.$inferInsert;
export type TournamentDivision = typeof tournamentDivisions.$inferSelect;
export type TeamsInTournament = typeof teamsInTournament.$inferSelect;
export type Pool = typeof pools.$inferSelect;
export type Game = typeof games.$inferSelect;
export type InsertGame = typeof games.$inferInsert;
export type Bracket = typeof brackets.$inferSelect;
export type Ranking = typeof rankings.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;
export type Receipt = typeof receipts.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type Follower = typeof followers.$inferSelect;
export type Notification = typeof notifications.$inferSelect;

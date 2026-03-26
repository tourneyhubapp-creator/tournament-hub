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
  // Social media links
  instagramHandle: varchar("instagramHandle", { length: 100 }),
  twitterHandle: varchar("twitterHandle", { length: 100 }),
  tiktokHandle: varchar("tiktokHandle", { length: 100 }),
  youtubeChannel: varchar("youtubeChannel", { length: 100 }),
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
// ZORTS TOURNAMENTS (External Data)
// ─────────────────────────────────────────────
export const zortsTournaments = mysqlTable("zorts_tournaments", {
  id: int("id").autoincrement().primaryKey(),
  externalId: varchar("externalId", { length: 100 }).unique(),
  name: varchar("name", { length: 300 }).notNull(),
  hostOrganization: varchar("hostOrganization", { length: 200 }),
  location: varchar("location", { length: 300 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  status: mysqlEnum("status", ["upcoming", "in_progress", "completed"]).default("upcoming"),
  participatingTeams: int("participatingTeams").default(0),
  bracketData: text("bracketData"),
  resultsData: text("resultsData"),
  source: varchar("source", { length: 50 }).default("zorts"),
  syncedAt: timestamp("syncedAt").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// TEAM LOGOS (Auto-detected)
// ─────────────────────────────────────────────
export const teamLogos = mysqlTable("team_logos", {
  id: int("id").autoincrement().primaryKey(),
  teamId: int("teamId").notNull(),
  logoUrl: text("logoUrl").notNull(),
  source: varchar("source", { length: 50 }).default("auto_detected"),
  confidence: decimal("confidence", { precision: 3, scale: 2 }).default("1.00"),
  detectedAt: timestamp("detectedAt").defaultNow(),
});

// ─────────────────────────────────────────────
// TOURNAMENT WAIVERS & FORMS
// ─────────────────────────────────────────────
export const tournamentWaivers = mysqlTable("tournament_waivers", {
  id: int("id").autoincrement().primaryKey(),
  tournamentId: int("tournamentId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  isRequired: boolean("isRequired").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// WAIVER SIGNATURES
// ─────────────────────────────────────────────
export const waiverSignatures = mysqlTable("waiver_signatures", {
  id: int("id").autoincrement().primaryKey(),
  waiverId: int("waiverId").notNull(),
  userId: int("userId").notNull(),
  teamId: int("teamId").notNull(),
  signedAt: timestamp("signedAt").defaultNow(),
});

// ─────────────────────────────────────────────
// TOURNAMENT REQUIREMENTS (Eligibility Rules)
// ─────────────────────────────────────────────
export const tournamentRequirements = mysqlTable("tournament_requirements", {
  id: int("id").autoincrement().primaryKey(),
  tournamentId: int("tournamentId").notNull(),
  minGraduationYear: int("minGraduationYear"),
  maxGraduationYear: int("maxGraduationYear"),
  minAge: int("minAge"),
  maxAge: int("maxAge"),
  maxRosterSize: int("maxRosterSize"),
  requiresPassport: boolean("requiresPassport").default(true),
  customRequirements: text("customRequirements"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// PLAYER STATS (QB, Receivers, Defense, Team)
// ─────────────────────────────────────────────
export const playerStats = mysqlTable("player_stats", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  teamId: int("teamId").notNull(),
  tournamentId: int("tournamentId").notNull(),
  gameId: int("gameId"),
  position: varchar("position", { length: 50 }).notNull(),
  // QB Stats
  passingYards: int("passingYards").default(0),
  passingTouchdowns: int("passingTouchdowns").default(0),
  interceptions: int("interceptions").default(0),
  completions: int("completions").default(0),
  attempts: int("attempts").default(0),
  // Receiver Stats
  receptions: int("receptions").default(0),
  receivingYards: int("receivingYards").default(0),
  receivingTouchdowns: int("receivingTouchdowns").default(0),
  // Defense Stats
  tackles: int("tackles").default(0),
  passBreakups: int("passBreakups").default(0),
  defensiveInterceptions: int("defensiveInterceptions").default(0),
  // Team Stats
  pointsScored: int("pointsScored").default(0),
  pointsAllowed: int("pointsAllowed").default(0),
  enteredBy: int("enteredBy").notNull(),
  verifiedAt: timestamp("verifiedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─────────────────────────────────────────────
// STAT LEADERBOARDS (Cached/Aggregated)
// ─────────────────────────────────────────────
export const statLeaderboards = mysqlTable("stat_leaderboards", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  position: varchar("position", { length: 50 }).notNull(),
  season: varchar("season", { length: 20 }).notNull(),
  graduationYear: int("graduationYear"),
  state: varchar("state", { length: 50 }),
  statType: varchar("statType", { length: 50 }).notNull(),
  statValue: int("statValue").default(0),
  rank: int("rank"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─────────────────────────────────────────────
// ATHLETE HEADSHOTS (for Facial Recognition)
// ─────────────────────────────────────────────
export const athleteHeadshots = mysqlTable("athlete_headshots", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  photoUrl: text("photoUrl").notNull(),
  isVerified: boolean("isVerified").default(false),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
  verifiedAt: timestamp("verifiedAt"),
});

// ─────────────────────────────────────────────
// FACIAL RECOGNITION CHECK-INS
// ─────────────────────────────────────────────
export const facialRecognitionCheckins = mysqlTable("facial_recognition_checkins", {
  id: int("id").autoincrement().primaryKey(),
  tournamentId: int("tournamentId").notNull(),
  athleteId: int("athleteId").notNull(),
  hostId: int("hostId").notNull(),
  matchConfidence: decimal("matchConfidence", { precision: 3, scale: 2 }).notNull(),
  verificationStatus: mysqlEnum("verificationStatus", ["confirmed", "unrecognized", "manual_verified"]).default("confirmed"),
  checkInMode: mysqlEnum("checkInMode", ["player_by_player", "group_photo"]).notNull(),
  checkedInAt: timestamp("checkedInAt").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// TEAM MEMBER INVITATIONS
// ─────────────────────────────────────────────
export const teamMemberInvitations = mysqlTable("team_member_invitations", {
  id: int("id").autoincrement().primaryKey(),
  tournamentId: int("tournamentId").notNull(),
  inviterId: int("inviterId").notNull(),
  inviteeId: int("inviteeId").notNull(),
  status: mysqlEnum("status", ["pending", "accepted", "declined", "revoked"]).default("pending"),
  permissionType: mysqlEnum("permissionType", ["facial_recognition_checkin", "score_entry", "full_admin"]).default("facial_recognition_checkin"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  acceptedAt: timestamp("acceptedAt"),
  revokedAt: timestamp("revokedAt"),
});

// ─────────────────────────────────────────────
// CHECK-IN PERMISSIONS
// ─────────────────────────────────────────────
export const checkInPermissions = mysqlTable("check_in_permissions", {
  id: int("id").autoincrement().primaryKey(),
  tournamentId: int("tournamentId").notNull(),
  userId: int("userId").notNull(),
  permissionType: mysqlEnum("permissionType", ["facial_recognition_checkin", "score_entry", "full_admin"]).default("facial_recognition_checkin"),
  grantedBy: int("grantedBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  revokedAt: timestamp("revokedAt"),
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
export type ZortsTournament = typeof zortsTournaments.$inferSelect;
export type TeamLogo = typeof teamLogos.$inferSelect;
export type TournamentWaiver = typeof tournamentWaivers.$inferSelect;
export type WaiverSignature = typeof waiverSignatures.$inferSelect;
export type TournamentRequirement = typeof tournamentRequirements.$inferSelect;
export type PlayerStat = typeof playerStats.$inferSelect;
export type InsertPlayerStat = typeof playerStats.$inferInsert;
export type StatLeaderboard = typeof statLeaderboards.$inferSelect;
export type AthleteHeadshot = typeof athleteHeadshots.$inferSelect;
export type InsertAthleteHeadshot = typeof athleteHeadshots.$inferInsert;
export type FacialRecognitionCheckin = typeof facialRecognitionCheckins.$inferSelect;
export type InsertFacialRecognitionCheckin = typeof facialRecognitionCheckins.$inferInsert;
export type TeamMemberInvitation = typeof teamMemberInvitations.$inferSelect;
export type InsertTeamMemberInvitation = typeof teamMemberInvitations.$inferInsert;
export type CheckInPermission = typeof checkInPermissions.$inferSelect;
export type InsertCheckInPermission = typeof checkInPermissions.$inferInsert;

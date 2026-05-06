
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// ─────────────────────────────────────────────
// TOURNAMENT HUB QUERY HELPERS
// ─────────────────────────────────────────────
import { and, count, desc, eq, sql } from "drizzle-orm";
import {
  athleteHeadshots,
  athleteProfiles,
  brackets,
  checkInPermissions,
  facialRecognitionCheckins,
  followers,
  games,
  messages,
  notifications,
  passportDocuments,
  payments,
  platformConfig,
  playerPassports,
  pools,
  postComments,
  postLikes,
  posts,
  rankings,
  receipts,
  teamMemberInvitations,
  teamMembers,
  teams,
  teamsInTournament,
  tournamentDivisions,
  tournaments,
  type InsertAthleteProfile,
  type InsertGame,
  type InsertPayment,
  type InsertPost,
  type InsertTeam,
  type InsertTournament,
} from "../drizzle/schema";

// USERS
export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0] ?? null;
}

export async function updateUser(id: number, data: Partial<{ name: string | null; avatarUrl: string | null; bio: string | null; city: string | null; state: string | null; role: "athlete" | "host" | "admin" }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users).set(data).where(eq(users.id, id));
}

export async function getAllUsers(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).limit(limit).offset(offset).orderBy(desc(users.createdAt));
}

// ATHLETE PROFILES
export async function getAthleteProfile(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(athleteProfiles).where(eq(athleteProfiles.userId, userId)).limit(1);
  return result[0] ?? null;
}

export async function upsertAthleteProfile(userId: number, data: Partial<InsertAthleteProfile>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getAthleteProfile(userId);
  if (existing) {
    await db.update(athleteProfiles).set(data).where(eq(athleteProfiles.userId, userId));
  } else {
    await db.insert(athleteProfiles).values({ userId, ...data });
  }
}

// PLAYER PASSPORTS
export async function getPassportByUserId(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(playerPassports).where(eq(playerPassports.userId, userId)).limit(1);
  return result[0] ?? null;
}

export async function createPassport(userId: number, data: { dateOfBirth?: string; graduationYear?: number; teamName?: string; photoUrl?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(playerPassports).values({ userId, ...data, status: "pending" });
  return (result as any)[0]?.insertId ?? 0;
}

export async function getPendingPassports() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(playerPassports).where(eq(playerPassports.status, "pending")).orderBy(desc(playerPassports.createdAt));
}

export async function approvePassport(passportId: number, playerId: string, qrCode: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  await db.update(playerPassports).set({ status: "approved", playerId, qrCode, approvedAt: new Date(), expiresAt }).where(eq(playerPassports.id, passportId));
}

export async function rejectPassport(passportId: number, reason: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(playerPassports).set({ status: "rejected", rejectionReason: reason }).where(eq(playerPassports.id, passportId));
}

export async function addPassportDocument(passportId: number, userId: number, docType: "birth_certificate" | "state_id" | "report_card" | "headshot", fileUrl: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(passportDocuments).values({ passportId, userId, docType, fileUrl });
  return (result as any)[0]?.insertId ?? 0;
}

export async function getPassportDocuments(passportId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(passportDocuments).where(eq(passportDocuments.passportId, passportId));
}

// TEAMS
export async function createTeam(data: InsertTeam) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(teams).values(data);
  return (result as any)[0]?.insertId ?? 0;
}

export async function getTeamById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(teams).where(eq(teams.id, id)).limit(1);
  return result[0] ?? null;
}

export async function getTeamsByOwner(ownerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(teams).where(eq(teams.ownerId, ownerId));
}

export async function getTeamMembers(teamId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(teamMembers).where(eq(teamMembers.teamId, teamId));
}

export async function addTeamMember(teamId: number, userId: number, role: "player" | "coach" | "manager" = "player") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(teamMembers).values({ teamId, userId, role });
  return (result as any)[0]?.insertId ?? 0;
}

// TOURNAMENTS
export async function createTournament(data: InsertTournament) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(tournaments).values(data);
  return (result as any)[0]?.insertId ?? 0;
}

export async function getTournamentById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(tournaments).where(eq(tournaments.id, id)).limit(1);
  return result[0] ?? null;
}

export async function getOpenTournaments(limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tournaments).where(eq(tournaments.status, "open")).limit(limit).offset(offset).orderBy(desc(tournaments.startDate));
}

export async function getAllTournaments(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tournaments).limit(limit).offset(offset).orderBy(desc(tournaments.createdAt));
}

export async function getTournamentsByHost(hostId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tournaments).where(eq(tournaments.hostId, hostId)).orderBy(desc(tournaments.createdAt));
}

export async function updateTournament(id: number, data: Partial<InsertTournament>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(tournaments).set(data).where(eq(tournaments.id, id));
}

export async function getTournamentRegistrations(tournamentId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(teamsInTournament).where(eq(teamsInTournament.tournamentId, tournamentId));
}

export async function registerTeamForTournament(data: { tournamentId: number; teamId: number; divisionId?: number; registeredBy: number; paymentId?: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(teamsInTournament).values({ ...data, paymentStatus: "pending" });
  return (result as any)[0]?.insertId ?? 0;
}

export async function createDivision(tournamentId: number, name: string, ageGroup?: string, maxTeams?: number, entryFee?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(tournamentDivisions).values({ tournamentId, name, ageGroup, maxTeams, entryFee });
  return (result as any)[0]?.insertId ?? 0;
}

export async function getDivisionsByTournament(tournamentId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tournamentDivisions).where(eq(tournamentDivisions.tournamentId, tournamentId));
}

// GAMES
export async function createGame(data: InsertGame) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(games).values(data);
  return (result as any)[0]?.insertId ?? 0;
}

export async function getGamesByTournament(tournamentId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(games).where(eq(games.tournamentId, tournamentId)).orderBy(games.scheduledAt);
}

export async function updateGameScore(gameId: number, homeScore: number, awayScore: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(games).set({ homeScore, awayScore, status: "completed", completedAt: new Date() }).where(eq(games.id, gameId));
}

// RANKINGS
export async function getNationalRankings(limit = 25) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(rankings).orderBy(rankings.nationalRank).limit(limit);
}

// PAYMENTS
export async function createPayment(data: InsertPayment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(payments).values(data);
  return (result as any)[0]?.insertId ?? 0;
}

export async function getPaymentsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(payments).where(eq(payments.userId, userId)).orderBy(desc(payments.createdAt));
}

export async function getAllPayments(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(payments).limit(limit).offset(offset).orderBy(desc(payments.createdAt));
}

export async function getHostRevenue(hostId: number) {
  const db = await getDb();
  if (!db) return { total: 0, platformFees: 0, netRevenue: 0 };
  const result = await db
    .select({ total: sql<number>`SUM(${payments.amount})`, platformFees: sql<number>`SUM(${payments.platformFee})`, netRevenue: sql<number>`SUM(${payments.hostAmount})` })
    .from(payments)
    .where(and(eq(payments.hostId, hostId), eq(payments.status, "completed")));
  return result[0] ?? { total: 0, platformFees: 0, netRevenue: 0 };
}

export async function getPlatformRevenue() {
  const db = await getDb();
  if (!db) return { total: 0, platformFees: 0 };
  const result = await db
    .select({ total: sql<number>`SUM(${payments.amount})`, platformFees: sql<number>`SUM(${payments.platformFee})` })
    .from(payments)
    .where(eq(payments.status, "completed"));
  return result[0] ?? { total: 0, platformFees: 0 };
}

export async function updatePaymentStatus(id: number, status: "completed" | "failed" | "refunded" | "frozen") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(payments).set({ status }).where(eq(payments.id, id));
}

// RECEIPTS
export async function createReceipt(data: { paymentId: number; userId: number; transactionId: string; teamName?: string; tournamentName?: string; totalPaid: string; hostAmount?: string; platformFee?: string; paymentMethod?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(receipts).values(data);
  return (result as any)[0]?.insertId ?? 0;
}

export async function getReceiptsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(receipts).where(eq(receipts.userId, userId)).orderBy(desc(receipts.createdAt));
}

// PLATFORM CONFIG
export async function getPlatformConfig(key: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(platformConfig).where(eq(platformConfig.key, key)).limit(1);
  return result[0]?.value ?? null;
}

export async function setPlatformConfig(key: string, value: string, description?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getPlatformConfig(key);
  if (existing !== null) {
    await db.update(platformConfig).set({ value }).where(eq(platformConfig.key, key));
  } else {
    await db.insert(platformConfig).values({ key, value, description });
  }
}

// POSTS
export async function createPost(data: InsertPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(posts).values(data);
  return (result as any)[0]?.insertId ?? 0;
}

export async function getFeedPosts(limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(posts).where(eq(posts.status, "active")).limit(limit).offset(offset).orderBy(desc(posts.createdAt));
}

export async function getTopPlays(limit = 10) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(posts).where(and(eq(posts.isTopPlay, true), eq(posts.status, "active"))).limit(limit).orderBy(desc(posts.likes));
}

export async function likePost(postId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(postLikes).values({ postId, userId });
  await db.update(posts).set({ likes: sql`${posts.likes} + 1` }).where(eq(posts.id, postId));
}

export async function addComment(postId: number, userId: number, content: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(postComments).values({ postId, userId, content });
  return (result as any)[0]?.insertId ?? 0;
}

export async function getFlaggedPosts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(posts).where(eq(posts.isFlagged, true)).orderBy(desc(posts.createdAt));
}

export async function moderatePost(postId: number, status: "active" | "removed" | "under_review") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(posts).set({ status }).where(eq(posts.id, postId));
}

// MESSAGES
export async function sendMessage(senderId: number, receiverId: number, content: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(messages).values({ senderId, receiverId, content });
  return (result as any)[0]?.insertId ?? 0;
}

export async function getConversation(userId1: number, userId2: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(messages).where(
    sql`(${messages.senderId} = ${userId1} AND ${messages.receiverId} = ${userId2}) OR (${messages.senderId} = ${userId2} AND ${messages.receiverId} = ${userId1})`
  ).orderBy(messages.createdAt);
}

// FOLLOWERS
export async function followUser(followerId: number, followingId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(followers).values({ followerId, followingId, followType: "user" });
}

export async function unfollowUser(followerId: number, followingId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(followers).where(and(eq(followers.followerId, followerId), eq(followers.followingId, followingId)));
}

// NOTIFICATIONS
export async function createNotification(data: { userId: number; type: "follow" | "message" | "ranking_update" | "tournament_invite" | "passport_approved" | "passport_rejected" | "score_update"; title: string; body?: string; relatedId?: number; relatedType?: string }) {
  const db = await getDb();
  if (!db) return;
  await db.insert(notifications).values(data);
}

export async function getNotifications(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(50);
}

export async function markNotificationRead(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
}
export async function getUnreadNotificationCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: count() }).from(notifications).where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  return result[0]?.count || 0;
}

// POOLS
export async function createPool(tournamentId: number, name: string, divisionId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(pools).values({ tournamentId, name, divisionId });
  return (result as any)[0]?.insertId ?? 0;
}

export async function getPoolsByTournament(tournamentId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pools).where(eq(pools.tournamentId, tournamentId));
}


// FACIAL RECOGNITION CHECK-IN
export async function uploadAthleteHeadshot(userId: number, photoUrl: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(athleteHeadshots).values({ userId, photoUrl, isVerified: false });
  return (result as any)[0]?.insertId ?? 0;
}

export async function createFacialRecognitionCheckin(
  tournamentId: number,
  athleteId: number,
  hostId: number,
  matchConfidence: number,
  checkInMode: "player_by_player" | "group_photo"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const verificationStatus = matchConfidence > 0.85 ? "confirmed" : "unrecognized";
  const result = await db.insert(facialRecognitionCheckins).values({
    tournamentId: tournamentId,
    athleteId: athleteId,
    hostId: hostId,
    matchConfidence: String(matchConfidence),
    verificationStatus: verificationStatus as "confirmed" | "unrecognized" | "manual_verified",
    checkInMode: checkInMode,
  });
  return (result as any)[0]?.insertId ?? 0;
}

export async function getCheckInsByTournament(tournamentId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(facialRecognitionCheckins).where(eq(facialRecognitionCheckins.tournamentId, tournamentId)).orderBy(desc(facialRecognitionCheckins.checkedInAt));
}

export async function inviteTeamMember(
  tournamentId: number,
  inviterId: number,
  inviteeId: number,
  permissionType: "facial_recognition_checkin" | "score_entry" | "full_admin"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(teamMemberInvitations).values({
    tournamentId,
    inviterId,
    inviteeId,
    permissionType,
  });
  return (result as any)[0]?.insertId ?? 0;
}

export async function acceptTeamMemberInvitation(invitationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(teamMemberInvitations).set({ status: "accepted", acceptedAt: new Date() }).where(eq(teamMemberInvitations.id, invitationId));
}

export async function getTeamMembersByTournament(tournamentId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(teamMemberInvitations).where(eq(teamMemberInvitations.tournamentId, tournamentId)).orderBy(desc(teamMemberInvitations.createdAt));
}

export async function revokeCheckInPermission(tournamentId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(checkInPermissions).set({ revokedAt: new Date() }).where(and(eq(checkInPermissions.tournamentId, tournamentId), eq(checkInPermissions.userId, userId)));
}

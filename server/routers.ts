import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,

  // ─────────────────────────────────────────────
  // AUTH
  // ─────────────────────────────────────────────
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─────────────────────────────────────────────
  // USERS
  // ─────────────────────────────────────────────
  users: router({
    me: protectedProcedure.query(({ ctx }) => db.getUserById(ctx.user.id)),

    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().min(1).max(200).optional(),
        bio: z.string().max(500).optional(),
        city: z.string().max(100).optional(),
        state: z.string().max(50).optional(),
        avatarUrl: z.string().url().optional(),
        role: z.enum(["athlete", "host", "admin"]).optional(),
      }))
      .mutation(({ ctx, input }) => db.updateUser(ctx.user.id, input)),

    getAll: protectedProcedure.query(() => db.getAllUsers()),
  }),

  // ─────────────────────────────────────────────
  // ATHLETE PROFILES
  // ─────────────────────────────────────────────
  athlete: router({
    getProfile: protectedProcedure.query(({ ctx }) => db.getAthleteProfile(ctx.user.id)),

    getProfileByUserId: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .query(({ input }) => db.getAthleteProfile(input.userId)),

    updateProfile: protectedProcedure
      .input(z.object({
        position: z.string().max(50).optional(),
        height: z.string().max(20).optional(),
        weight: z.number().int().optional(),
        graduationYear: z.number().int().optional(),
        school: z.string().max(200).optional(),
        gpa: z.string().optional(),
        fortyYardDash: z.string().optional(),
        verticalJump: z.string().optional(),
        benchPress: z.number().int().optional(),
        shuttle: z.string().optional(),
        hudlUrl: z.string().url().optional(),
        highlightUrl: z.string().url().optional(),
        passingYards: z.number().int().optional(),
        touchdowns: z.number().int().optional(),
        receptions: z.number().int().optional(),
        interceptions: z.number().int().optional(),
      }))
      .mutation(({ ctx, input }) => db.upsertAthleteProfile(ctx.user.id, input)),
  }),

  // ─────────────────────────────────────────────
  // PLAYER PASSPORTS
  // ─────────────────────────────────────────────
  passport: router({
    get: protectedProcedure.query(({ ctx }) => db.getPassportByUserId(ctx.user.id)),

    create: protectedProcedure
      .input(z.object({
        dateOfBirth: z.string().optional(),
        graduationYear: z.number().int().optional(),
        teamName: z.string().max(200).optional(),
        photoUrl: z.string().optional(),
      }))
      .mutation(({ ctx, input }) => db.createPassport(ctx.user.id, input)),

    uploadDocument: protectedProcedure
      .input(z.object({
        passportId: z.number().int(),
        docType: z.enum(["birth_certificate", "state_id", "report_card", "headshot"]),
        fileUrl: z.string(),
      }))
      .mutation(({ ctx, input }) => db.addPassportDocument(input.passportId, ctx.user.id, input.docType, input.fileUrl)),

    getDocuments: protectedProcedure
      .input(z.object({ passportId: z.number().int() }))
      .query(({ input }) => db.getPassportDocuments(input.passportId)),

    // Admin only
    getPending: protectedProcedure.query(() => db.getPendingPassports()),

    approve: protectedProcedure
      .input(z.object({
        passportId: z.number().int(),
        playerId: z.string(),
        qrCode: z.string(),
      }))
      .mutation(({ input }) => db.approvePassport(input.passportId, input.playerId, input.qrCode)),

    reject: protectedProcedure
      .input(z.object({
        passportId: z.number().int(),
        reason: z.string().min(1),
      }))
      .mutation(({ input }) => db.rejectPassport(input.passportId, input.reason)),
  }),

  // ─────────────────────────────────────────────
  // TEAMS
  // ─────────────────────────────────────────────
  teams: router({
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1).max(200),
        logoUrl: z.string().optional(),
        city: z.string().max(100).optional(),
        state: z.string().max(50).optional(),
        ageGroup: z.string().max(20).optional(),
        division: z.string().max(50).optional(),
      }))
      .mutation(({ ctx, input }) => db.createTeam({ ...input, ownerId: ctx.user.id })),

    getById: protectedProcedure
      .input(z.object({ id: z.number().int() }))
      .query(({ input }) => db.getTeamById(input.id)),

    myTeams: protectedProcedure.query(({ ctx }) => db.getTeamsByOwner(ctx.user.id)),

    getMembers: protectedProcedure
      .input(z.object({ teamId: z.number().int() }))
      .query(({ input }) => db.getTeamMembers(input.teamId)),

    addMember: protectedProcedure
      .input(z.object({
        teamId: z.number().int(),
        userId: z.number().int(),
        role: z.enum(["player", "coach", "manager"]).default("player"),
      }))
      .mutation(({ input }) => db.addTeamMember(input.teamId, input.userId, input.role)),
  }),

  // ─────────────────────────────────────────────
  // TOURNAMENTS
  // ─────────────────────────────────────────────
  tournaments: router({
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1).max(300),
        location: z.string().max(300).optional(),
        city: z.string().max(100).optional(),
        state: z.string().max(50).optional(),
        startDate: z.string(),
        endDate: z.string(),
        maxTeams: z.number().int().min(4),
        fieldsCount: z.number().int().default(1),
        standardFee: z.string(),
        earlyBirdFee: z.string().optional(),
        lateFee: z.string().optional(),
        description: z.string().optional(),
        bannerUrl: z.string().optional(),
      }))
      .mutation(({ ctx, input }) =>
        db.createTournament({
          ...input,
          hostId: ctx.user.id,
          startDate: new Date(input.startDate),
          endDate: new Date(input.endDate),
        })
      ),

    getById: publicProcedure
      .input(z.object({ id: z.number().int() }))
      .query(({ input }) => db.getTournamentById(input.id)),

    getOpen: publicProcedure
      .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
      .query(({ input }) => db.getOpenTournaments(input.limit, input.offset)),

    getAll: protectedProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
      .query(({ input }) => db.getAllTournaments(input.limit, input.offset)),

    myTournaments: protectedProcedure.query(({ ctx }) => db.getTournamentsByHost(ctx.user.id)),

    update: protectedProcedure
      .input(z.object({
        id: z.number().int(),
        name: z.string().max(300).optional(),
        status: z.enum(["draft", "open", "in_progress", "completed", "cancelled"]).optional(),
        description: z.string().optional(),
      }))
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return db.updateTournament(id, data);
      }),

    getRegistrations: protectedProcedure
      .input(z.object({ tournamentId: z.number().int() }))
      .query(({ input }) => db.getTournamentRegistrations(input.tournamentId)),

    register: protectedProcedure
      .input(z.object({
        tournamentId: z.number().int(),
        teamId: z.number().int(),
        divisionId: z.number().int().optional(),
      }))
      .mutation(({ ctx, input }) =>
        db.registerTeamForTournament({ ...input, registeredBy: ctx.user.id })
      ),

    addDivision: protectedProcedure
      .input(z.object({
        tournamentId: z.number().int(),
        name: z.string().min(1).max(100),
        ageGroup: z.string().max(30).optional(),
        maxTeams: z.number().int().optional(),
        entryFee: z.string().optional(),
      }))
      .mutation(({ input }) =>
        db.createDivision(input.tournamentId, input.name, input.ageGroup, input.maxTeams, input.entryFee)
      ),

    getDivisions: publicProcedure
      .input(z.object({ tournamentId: z.number().int() }))
      .query(({ input }) => db.getDivisionsByTournament(input.tournamentId)),
  }),

  // ─────────────────────────────────────────────
  // GAMES
  // ─────────────────────────────────────────────
  games: router({
    getByTournament: publicProcedure
      .input(z.object({ tournamentId: z.number().int() }))
      .query(({ input }) => db.getGamesByTournament(input.tournamentId)),

    create: protectedProcedure
      .input(z.object({
        tournamentId: z.number().int(),
        homeTeamId: z.number().int(),
        awayTeamId: z.number().int(),
        poolId: z.number().int().optional(),
        field: z.string().max(50).optional(),
        scheduledAt: z.string().optional(),
        gameType: z.enum(["pool", "bracket"]).default("pool"),
      }))
      .mutation(({ input }) =>
        db.createGame({
          ...input,
          scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : undefined,
        })
      ),

    updateScore: protectedProcedure
      .input(z.object({
        gameId: z.number().int(),
        homeScore: z.number().int().min(0),
        awayScore: z.number().int().min(0),
      }))
      .mutation(({ input }) => db.updateGameScore(input.gameId, input.homeScore, input.awayScore)),
  }),

  // ─────────────────────────────────────────────
  // RANKINGS
  // ─────────────────────────────────────────────
  rankings: router({
    national: publicProcedure
      .input(z.object({ limit: z.number().default(25) }))
      .query(({ input }) => db.getNationalRankings(input.limit)),
  }),

  // ─────────────────────────────────────────────
  // PAYMENTS
  // ─────────────────────────────────────────────
  payments: router({
    myPayments: protectedProcedure.query(({ ctx }) => db.getPaymentsByUser(ctx.user.id)),

    myReceipts: protectedProcedure.query(({ ctx }) => db.getReceiptsByUser(ctx.user.id)),

    create: protectedProcedure
      .input(z.object({
        type: z.enum(["passport", "tournament_entry", "refund"]),
        amount: z.string(),
        platformFee: z.string().optional(),
        hostAmount: z.string().optional(),
        paymentMethod: z.enum(["card", "apple_pay", "venmo", "cash_app"]),
        tournamentId: z.number().int().optional(),
        teamId: z.number().int().optional(),
        hostId: z.number().int().optional(),
      }))
      .mutation(({ ctx, input }) =>
        db.createPayment({ ...input, userId: ctx.user.id, status: "pending" })
      ),

    // Admin only
    getAll: protectedProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
      .query(({ input }) => db.getAllPayments(input.limit, input.offset)),

    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number().int(),
        status: z.enum(["completed", "failed", "refunded", "frozen"]),
      }))
      .mutation(({ input }) => db.updatePaymentStatus(input.id, input.status)),

    hostRevenue: protectedProcedure.query(({ ctx }) => db.getHostRevenue(ctx.user.id)),

    platformRevenue: protectedProcedure.query(() => db.getPlatformRevenue()),
  }),

  // ─────────────────────────────────────────────
  // SOCIAL FEED
  // ─────────────────────────────────────────────
  feed: router({
    getPosts: publicProcedure
      .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
      .query(({ input }) => db.getFeedPosts(input.limit, input.offset)),

    getTopPlays: publicProcedure
      .input(z.object({ limit: z.number().default(10) }))
      .query(({ input }) => db.getTopPlays(input.limit)),

    createPost: protectedProcedure
      .input(z.object({
        caption: z.string().max(2000).optional(),
        mediaUrl: z.string(),
        mediaType: z.enum(["video", "photo"]),
        thumbnailUrl: z.string().optional(),
      }))
      .mutation(({ ctx, input }) => db.createPost({ ...input, userId: ctx.user.id })),

    likePost: protectedProcedure
      .input(z.object({ postId: z.number().int() }))
      .mutation(({ ctx, input }) => db.likePost(input.postId, ctx.user.id)),

    addComment: protectedProcedure
      .input(z.object({ postId: z.number().int(), content: z.string().min(1).max(1000) }))
      .mutation(({ ctx, input }) => db.addComment(input.postId, ctx.user.id, input.content)),

    // Admin moderation
    getFlagged: protectedProcedure.query(() => db.getFlaggedPosts()),

    moderatePost: protectedProcedure
      .input(z.object({
        postId: z.number().int(),
        status: z.enum(["active", "removed", "under_review"]),
      }))
      .mutation(({ input }) => db.moderatePost(input.postId, input.status)),
  }),

  // ─────────────────────────────────────────────
  // MESSAGES
  // ─────────────────────────────────────────────
  messages: router({
    send: protectedProcedure
      .input(z.object({
        receiverId: z.number().int(),
        content: z.string().min(1).max(2000),
      }))
      .mutation(({ ctx, input }) => db.sendMessage(ctx.user.id, input.receiverId, input.content)),

    getConversation: protectedProcedure
      .input(z.object({ otherUserId: z.number().int() }))
      .query(({ ctx, input }) => db.getConversation(ctx.user.id, input.otherUserId)),
  }),

  // ─────────────────────────────────────────────
  // FOLLOWERS
  // ─────────────────────────────────────────────
  social: router({
    follow: protectedProcedure
      .input(z.object({ followingId: z.number().int() }))
      .mutation(({ ctx, input }) => db.followUser(ctx.user.id, input.followingId)),

    unfollow: protectedProcedure
      .input(z.object({ followingId: z.number().int() }))
      .mutation(({ ctx, input }) => db.unfollowUser(ctx.user.id, input.followingId)),
  }),

  // ─────────────────────────────────────────────
  // NOTIFICATIONS
  // ─────────────────────────────────────────────
  notifications: router({
    get: protectedProcedure.query(({ ctx }) => db.getNotifications(ctx.user.id)),

    markRead: protectedProcedure
      .input(z.object({ id: z.number().int() }))
      .mutation(({ input }) => db.markNotificationRead(input.id)),
  }),

  // ─────────────────────────────────────────────
  // FACIAL RECOGNITION CHECK-IN
  // ─────────────────────────────────────────────
  facialRecognition: router({
    uploadHeadshot: protectedProcedure
      .input(z.object({
        photoUrl: z.string().url(),
      }))
      .mutation(({ ctx, input }) => db.uploadAthleteHeadshot(ctx.user.id, input.photoUrl)),

    checkIn: protectedProcedure
      .input(z.object({
        tournamentId: z.number(),
        athleteId: z.number(),
        matchConfidence: z.number().min(0).max(1),
        checkInMode: z.enum(["player_by_player", "group_photo"]),
      }))
      .mutation(({ ctx, input }) => db.createFacialRecognitionCheckin(
        input.tournamentId,
        input.athleteId,
        ctx.user.id,
        input.matchConfidence,
        input.checkInMode
      )),

    getCheckIns: protectedProcedure
      .input(z.object({ tournamentId: z.number() }))
      .query(({ input }) => db.getCheckInsByTournament(input.tournamentId)),

    inviteTeamMember: protectedProcedure
      .input(z.object({
        tournamentId: z.number(),
        inviteeId: z.number(),
        permissionType: z.enum(["facial_recognition_checkin", "score_entry", "full_admin"]),
      }))
      .mutation(({ ctx, input }) => db.inviteTeamMember(
        input.tournamentId,
        ctx.user.id,
        input.inviteeId,
        input.permissionType
      )),

    acceptInvitation: protectedProcedure
      .input(z.object({ invitationId: z.number() }))
      .mutation(({ input }) => db.acceptTeamMemberInvitation(input.invitationId)),

    getTeamMembers: protectedProcedure
      .input(z.object({ tournamentId: z.number() }))
      .query(({ input }) => db.getTeamMembersByTournament(input.tournamentId)),

    revokeAccess: protectedProcedure
      .input(z.object({
        tournamentId: z.number(),
        userId: z.number(),
      }))
      .mutation(({ input }) => db.revokeCheckInPermission(input.tournamentId, input.userId)),
  }),

  // ─────────────────────────────────────────────
  // PLATFORM CONFIG (Admin)
  // ─────────────────────────────────────────────
  config: router({
    get: publicProcedure
      .input(z.object({ key: z.string() }))
      .query(({ input }) => db.getPlatformConfig(input.key)),

    set: protectedProcedure
      .input(z.object({
        key: z.string().min(1).max(100),
        value: z.string(),
        description: z.string().optional(),
      }))
      .mutation(({ input }) => db.setPlatformConfig(input.key, input.value, input.description)),
  }),
});

export type AppRouter = typeof appRouter;

/**
 * Team Rankings Algorithm
 * 
 * Scoring System:
 * - Base Points: Wins * 10 + Ties * 5
 * - Tournament Tier Multiplier:
 *   - Tier 1 (OT7, Battle 7's, The Sevens): 3.0x
 *   - Tier 2 (Pylon 7v7, ShockDoctor Legends, Prep Redzone): 2.0x
 *   - Tier 3 (All others): 1.0x
 * - Strength of Schedule: Average opponent ranking * 0.1
 * - Head-to-Head: Direct wins against ranked teams * 2
 */

export interface TeamRankingData {
  teamId: number;
  teamName: string;
  wins: number;
  losses: number;
  ties: number;
  gamesPlayed: number;
  pointsFor: number;
  pointsAgainst: number;
  pointDifferential: number;
  winPercentage: number;
  tournamentTier: number;
  totalRankingPoints: number;
  strengthOfSchedule: number;
  rank: number;
}

export interface TournamentData {
  id: number;
  name: string;
  tier: number;
  teams: Array<{
    id: number;
    name: string;
    wins: number;
    losses: number;
    ties: number;
    pointsFor: number;
    pointsAgainst: number;
  }>;
}

export class TeamRankingsCalculator {
  private tournaments: TournamentData[] = [];
  private teamStats: Map<number, TeamRankingData> = new Map();

  constructor(tournaments: TournamentData[]) {
    this.tournaments = tournaments;
    this.calculateRankings();
  }

  private calculateRankings(): void {
    // First pass: Calculate base stats for each team
    const teamMap = new Map<number, TeamRankingData>();

    for (const tournament of this.tournaments) {
      for (const team of tournament.teams) {
        const existing = teamMap.get(team.id) || {
          teamId: team.id,
          teamName: team.name,
          wins: 0,
          losses: 0,
          ties: 0,
          gamesPlayed: 0,
          pointsFor: 0,
          pointsAgainst: 0,
          pointDifferential: 0,
          winPercentage: 0,
          tournamentTier: tournament.tier,
          totalRankingPoints: 0,
          strengthOfSchedule: 0,
          rank: 0,
        };

        existing.wins += team.wins;
        existing.losses += team.losses;
        existing.ties += team.ties;
        existing.gamesPlayed += team.wins + team.losses + team.ties;
        existing.pointsFor += team.pointsFor;
        existing.pointsAgainst += team.pointsAgainst;
        existing.pointDifferential = existing.pointsFor - existing.pointsAgainst;
        existing.tournamentTier = Math.min(existing.tournamentTier, tournament.tier); // Use highest tier

        teamMap.set(team.id, existing);
      }
    }

    // Second pass: Calculate ranking points
    for (const [teamId, teamData] of teamMap) {
      // Base points: Wins * 10 + Ties * 5
      let basePoints = teamData.wins * 10 + teamData.ties * 5;

      // Tournament tier multiplier
      const tierMultiplier = this.getTierMultiplier(teamData.tournamentTier);
      basePoints *= tierMultiplier;

      // Win percentage bonus
      if (teamData.gamesPlayed > 0) {
        teamData.winPercentage = (teamData.wins / teamData.gamesPlayed) * 100;
        basePoints += teamData.winPercentage * 0.5; // Win % bonus
      }

      // Point differential bonus (max +50 points)
      const pointDifferentialBonus = Math.min(teamData.pointDifferential / 10, 50);
      basePoints += pointDifferentialBonus;

      teamData.totalRankingPoints = Math.round(basePoints);
      this.teamStats.set(teamId, teamData);
    }

    // Third pass: Sort and assign ranks
    const sortedTeams = Array.from(this.teamStats.values()).sort(
      (a, b) => b.totalRankingPoints - a.totalRankingPoints
    );

    sortedTeams.forEach((team, index) => {
      team.rank = index + 1;
      this.teamStats.set(team.teamId, team);
    });
  }

  private getTierMultiplier(tier: number): number {
    switch (tier) {
      case 1:
        return 3.0; // Tier 1: OT7, Battle 7's, The Sevens
      case 2:
        return 2.0; // Tier 2: Pylon 7v7, ShockDoctor Legends, Prep Redzone
      default:
        return 1.0; // Tier 3: All others
    }
  }

  public getTeamRankings(): TeamRankingData[] {
    return Array.from(this.teamStats.values())
      .sort((a, b) => a.rank - b.rank);
  }

  public getTeamRank(teamId: number): TeamRankingData | undefined {
    return this.teamStats.get(teamId);
  }

  public getTopTeams(limit: number = 25): TeamRankingData[] {
    return this.getTeamRankings().slice(0, limit);
  }

  public getTeamsByTier(tier: number): TeamRankingData[] {
    return this.getTeamRankings().filter(team => team.tournamentTier === tier);
  }
}

// Mock tournament data for development
export const MOCK_TOURNAMENTS: TournamentData[] = [
  {
    id: 1,
    name: 'OT7 Spring Classic',
    tier: 1,
    teams: [
      { id: 101, name: 'Tucson Turf', wins: 4, losses: 1, ties: 0, pointsFor: 156, pointsAgainst: 98 },
      { id: 102, name: 'AZ Dolphins', wins: 3, losses: 2, ties: 0, pointsFor: 142, pointsAgainst: 115 },
      { id: 103, name: 'Premium', wins: 4, losses: 0, ties: 1, pointsFor: 165, pointsAgainst: 89 },
      { id: 104, name: 'CALI POWER', wins: 3, losses: 1, ties: 1, pointsFor: 138, pointsAgainst: 102 },
    ]
  },
  {
    id: 2,
    name: 'Battle 7s Elite Tournament',
    tier: 1,
    teams: [
      { id: 105, name: 'Defcon TexasPremier', wins: 5, losses: 0, ties: 0, pointsFor: 178, pointsAgainst: 76 },
      { id: 106, name: 'Texas Xtreme', wins: 4, losses: 1, ties: 0, pointsFor: 159, pointsAgainst: 98 },
      { id: 107, name: 'LOPRO', wins: 3, losses: 2, ties: 0, pointsFor: 145, pointsAgainst: 128 },
      { id: 108, name: 'Texas Chaos', wins: 2, losses: 3, ties: 0, pointsFor: 118, pointsAgainst: 142 },
    ]
  },
  {
    id: 3,
    name: 'The Sevens Football Championship',
    tier: 1,
    teams: [
      { id: 109, name: 'RgIIIBlack', wins: 5, losses: 1, ties: 0, pointsFor: 172, pointsAgainst: 105 },
      { id: 110, name: 'Valleys Finest', wins: 4, losses: 2, ties: 0, pointsFor: 155, pointsAgainst: 118 },
      { id: 111, name: 'GATA', wins: 4, losses: 1, ties: 0, pointsFor: 162, pointsAgainst: 95 },
      { id: 112, name: 'SFE BLACK', wins: 3, losses: 3, ties: 0, pointsFor: 138, pointsAgainst: 135 },
    ]
  },
  {
    id: 4,
    name: 'Pylon 7v7 Spring Showcase',
    tier: 2,
    teams: [
      { id: 113, name: '24KCold Hearts', wins: 3, losses: 1, ties: 0, pointsFor: 128, pointsAgainst: 98 },
      { id: 114, name: 'The Lab', wins: 4, losses: 0, ties: 0, pointsFor: 152, pointsAgainst: 82 },
      { id: 115, name: 'Midwest Boom17U', wins: 2, losses: 2, ties: 0, pointsFor: 112, pointsAgainst: 118 },
      { id: 116, name: 'CAT Takeover', wins: 3, losses: 1, ties: 0, pointsFor: 135, pointsAgainst: 105 },
    ]
  },
  {
    id: 5,
    name: 'ShockDoctor Legends Invitational',
    tier: 2,
    teams: [
      { id: 117, name: '816Elite', wins: 4, losses: 1, ties: 0, pointsFor: 148, pointsAgainst: 102 },
      { id: 118, name: 'Strongside KC18U White', wins: 3, losses: 2, ties: 0, pointsFor: 132, pointsAgainst: 125 },
      { id: 119, name: 'WARREN ACADEMYSupreme', wins: 2, losses: 2, ties: 1, pointsFor: 118, pointsAgainst: 128 },
      { id: 120, name: 'ALL-EN', wins: 3, losses: 1, ties: 1, pointsFor: 138, pointsAgainst: 108 },
    ]
  },
  {
    id: 6,
    name: 'Prep Redzone Tournament',
    tier: 2,
    teams: [
      { id: 121, name: 'The Woodlands', wins: 4, losses: 1, ties: 0, pointsFor: 155, pointsAgainst: 105 },
      { id: 122, name: '5PKutFootball', wins: 3, losses: 2, ties: 0, pointsFor: 138, pointsAgainst: 125 },
      { id: 123, name: 'Slimey Boyz', wins: 3, losses: 2, ties: 0, pointsFor: 142, pointsAgainst: 132 },
      { id: 124, name: 'EPIC 7Black', wins: 2, losses: 3, ties: 0, pointsFor: 115, pointsAgainst: 142 },
    ]
  },
  {
    id: 7,
    name: 'Championship 7v7 Winter Cup',
    tier: 3,
    teams: [
      { id: 125, name: 'Miami Elite', wins: 3, losses: 1, ties: 0, pointsFor: 125, pointsAgainst: 95 },
      { id: 126, name: 'South Florida United', wins: 2, losses: 2, ties: 0, pointsFor: 108, pointsAgainst: 115 },
      { id: 127, name: 'Florida Thunder', wins: 2, losses: 1, ties: 1, pointsFor: 105, pointsAgainst: 98 },
      { id: 128, name: 'Sunshine State Stars', wins: 1, losses: 3, ties: 0, pointsFor: 85, pointsAgainst: 125 },
    ]
  },
  {
    id: 8,
    name: 'DR7 Regional Championship',
    tier: 3,
    teams: [
      { id: 129, name: 'Denver Dynamos', wins: 4, losses: 0, ties: 0, pointsFor: 148, pointsAgainst: 78 },
      { id: 130, name: 'Rocky Mountain Elite', wins: 3, losses: 1, ties: 0, pointsFor: 135, pointsAgainst: 102 },
      { id: 131, name: 'Colorado Springs Force', wins: 2, losses: 2, ties: 0, pointsFor: 112, pointsAgainst: 125 },
      { id: 132, name: 'Front Range Warriors', wins: 1, losses: 3, ties: 0, pointsFor: 92, pointsAgainst: 138 },
    ]
  },
  {
    id: 9,
    name: 'C1N Tournament Series',
    tier: 3,
    teams: [
      { id: 133, name: 'Chicago Legends', wins: 3, losses: 1, ties: 0, pointsFor: 132, pointsAgainst: 98 },
      { id: 134, name: 'Midwest Titans', wins: 3, losses: 1, ties: 0, pointsFor: 138, pointsAgainst: 105 },
      { id: 135, name: 'Illinois Elite', wins: 2, losses: 2, ties: 0, pointsFor: 115, pointsAgainst: 125 },
      { id: 136, name: 'Great Lakes United', wins: 1, losses: 3, ties: 0, pointsFor: 88, pointsAgainst: 135 },
    ]
  },
];

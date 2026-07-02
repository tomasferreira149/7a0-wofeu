// Enums for standardization

export type Position5v5 = 'GK' | 'CB' | 'CM' | 'CF';

export type TournamentStatus = 'ACTIVE' | 'FINISHED' | 'ARCHIVED';

export type Formation = '2-2' | '1-2-1' | '3-1' | '2-1-1';

export type Posture = 'DEFENSIVE' | 'BALANCED' | 'POSITIVE';



// Base Entities

export interface Friend {

  id: string;

  name: string;

  nationality: string;

}



export interface Tournament {

  id: string;

  name: string;

  status: TournamentStatus;

}



// Intermediate Entity (The physical "Card" in the game)

export interface TournamentCard {

  id: string;

  friendId: string;

  tournamentId: string;

  position: Position5v5;

  attack: number;

  defense: number;

  overall: number;

  // Exclusivity Rule: If a string is present, someone in the room already picked it

  lockedInRoomId: string | null; 

}



// Game and Multiplayer Entities

export interface SelectedTeam {

  id: string;

  playerId: string; // The user controlling the team

  cardIds: string[]; // Exactly 5 IDs

  formation: Formation;

  posture: Posture;

  averageAttack: number;

  averageDefense: number;

}



export interface Match {

  id: string;

  teamAId: string;

  teamBId: string;

  scoreA: number;

  scoreB: number;

  currentMinute: number; // 0 to 90

  logs: string[];

  winnerId: string | null;

}
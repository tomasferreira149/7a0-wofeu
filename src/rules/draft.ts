import { TournamentCard } from '../models/types';

interface DraftState {
  playerId: string;
  usedRerolls: number; // Max 3
  currentCards: TournamentCard[];
}

export function validateRerollOptions(
  draft: DraftState, 
  allDatabaseCards: TournamentCard[]
): { canChangeTeam: boolean, canChangeTournament: boolean } {
  
  if (draft.usedRerolls >= 3) {
    return { canChangeTeam: false, canChangeTournament: false };
  }

  const canChangeTeam = true; 
  let canChangeTournament = true;

  // Check Option B: Do these 5 players exist in ANY OTHER tournament?
  for (const card of draft.currentCards) {
    const versionsOfThisFriend = allDatabaseCards.filter(c => 
      c.friendId === card.friendId && c.tournamentId !== card.tournamentId
    );

    // If even ONE player doesn't have an alternate version, block Option B
    if (versionsOfThisFriend.length === 0) {
      canChangeTournament = false;
      break; 
    }
  }

  return { canChangeTeam, canChangeTournament };
}


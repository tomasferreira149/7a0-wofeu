import { SelectedTeam, Match } from '../models/types';

const MODIFIERS = {
  formation: {
    '2-2':   { atk: 1.00, def: 1.00 },
    '1-2-1': { atk: 1.05, def: 0.95 },
    '3-1':   { atk: 0.85, def: 1.15 },
    '2-1-1': { atk: 1.15, def: 0.85 }
  },
  posture: {
    'DEFENSIVE': { atk: 0.90, def: 1.10 },
    'BALANCED':  { atk: 1.00, def: 1.00 },
    'POSITIVE':  { atk: 1.10, def: 0.90 }
  }
};

function calculateFinalStrength(team: SelectedTeam) {
  const modFormation = MODIFIERS.formation[team.formation];
  const modPosture = MODIFIERS.posture[team.posture];
  
  return {
    attack: team.averageAttack * modFormation.atk * modPosture.atk,
    defense: team.averageDefense * modFormation.def * modPosture.def
  };
}

export function runLiveSimulation(teamA: SelectedTeam, teamB: SelectedTeam): Match {
  let match: Match = {
    id: `match_${Date.now()}`,
    teamAId: teamA.id,
    teamBId: teamB.id,
    scoreA: 0,
    scoreB: 0,
    currentMinute: 0,
    logs: [],
    winnerId: null
  };

  const strengthA = calculateFinalStrength(teamA);
  const strengthB = calculateFinalStrength(teamB);

  for (let minute = 1; minute <= 90; minute++) {
    match.currentMinute = minute;

    // RNG / Surprise Factor (1 to 100)
    const rngA = Math.floor(Math.random() * 100) + 1;
    const rngB = Math.floor(Math.random() * 100) + 1;

    // Team A attacks
    const attemptTeamA = (strengthA.attack * 0.7) + rngA;
    const resistanceTeamB = (strengthB.defense * 0.7) + rngB;

    if (attemptTeamA > resistanceTeamB + 30) {
      match.scoreA++;
      match.logs.push(`${minute}' - GOAL FOR TEAM A! The CF receives it, spins, and blasts it past the GK!`);
    } else if (attemptTeamA > resistanceTeamB + 15) {
      match.logs.push(`${minute}' - OOH! Quick counter-attack by Team A's CM, but the GK makes a spectacular save!`);
    }

    // Team B attacks
    const attemptTeamB = (strengthB.attack * 0.7) + rngB;
    const resistanceTeamA = (strengthA.defense * 0.7) + rngA;

    if (attemptTeamB > resistanceTeamA + 30) {
      match.scoreB++;
      match.logs.push(`${minute}' - GOAL FOR TEAM B! Beautiful set-piece, the CB passes to the CF who taps it in!`);
    } else if (attemptTeamB > resistanceTeamA + 15) {
      match.logs.push(`${minute}' - GREAT TACKLE! Team B was looking dangerous, but Team A's CB steals the ball cleanly.`);
    }
  }

  if (match.scoreA > match.scoreB) match.winnerId = teamA.id;
  else if (match.scoreB > match.scoreA) match.winnerId = teamB.id;

  return match;
}


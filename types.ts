
export enum AppState {
  SETUP,
  ENTRY,
  TOURNAMENT,
  FINISHED,
}

export interface Participant {
  id: number;
  name: string;
}

export interface Match {
  id: number;
  participantIds: (number | null)[];
  winnerId: number | null;
}

export interface Round {
  id: number;
  title: string;
  matches: Match[];
}

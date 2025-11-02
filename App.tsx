
import React, { useState, useEffect, useCallback } from 'react';
import { AppState, Participant, Round, Match } from './types.ts';
import SetupScreen from './components/SetupScreen.tsx';
import EntryScreen from './components/EntryScreen.tsx';
import TournamentBracket from './components/TournamentBracket.tsx';
import WinnerDisplay from './components/WinnerDisplay.tsx';

// Fisher-Yates shuffle algorithm
// FIX: Corrected generic type parameter syntax from <T> to <T,> to resolve JSX parsing ambiguity.
const shuffle = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};


function App() {
  const [appState, setAppState] = useState<AppState>(AppState.SETUP);
  const [numParticipants, setNumParticipants] = useState<number>(0);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [tournamentTitle, setTournamentTitle] = useState<string>('');

  const handleSetupComplete = (count: number, title: string) => {
    setNumParticipants(count);
    setTournamentTitle(title);
    setAppState(AppState.ENTRY);
  };

  const handleEntriesComplete = (names: string[]) => {
    const newParticipants: Participant[] = names.map((name, index) => ({
      id: index,
      name: name,
    }));
    setParticipants(newParticipants);

    const shuffledParticipants = shuffle(newParticipants);

    const firstRoundMatches: Match[] = [];
    for (let i = 0; i < shuffledParticipants.length; i += 2) {
      firstRoundMatches.push({
        id: i / 2,
        participantIds: [shuffledParticipants[i].id, shuffledParticipants[i + 1].id],
        winnerId: null,
      });
    }

    const firstRound: Round = {
      id: 0,
      title: `Round 1`,
      matches: firstRoundMatches,
    };

    setRounds([firstRound]);
    setAppState(AppState.TOURNAMENT);
  };

  const handleSelectWinner = (matchId: number, winnerId: number) => {
    setRounds(prevRounds =>
      prevRounds.map(round => ({
        ...round,
        matches: round.matches.map(match =>
          match.id === matchId ? { ...match, winnerId } : match
        ),
      }))
    );
  };

  const handleReset = () => {
    setAppState(AppState.SETUP);
    setNumParticipants(0);
    setParticipants([]);
    setRounds([]);
    setWinner(null);
    setTournamentTitle('');
  };
  
  const generateNextRound = useCallback(() => {
    if (appState !== AppState.TOURNAMENT || rounds.length === 0) {
      return;
    }

    const lastRound = rounds[rounds.length - 1];
    const isRoundComplete = lastRound.matches.every(m => m.winnerId !== null);

    if (!isRoundComplete) {
      return;
    }

    if (lastRound.matches.length === 1) {
      const finalWinner = participants.find(p => p.id === lastRound.matches[0].winnerId!);
      if (finalWinner) {
        setWinner(finalWinner);
        setAppState(AppState.FINISHED);
      }
      return;
    }

    const winners = lastRound.matches
      .map(match => participants.find(p => p.id === match.winnerId!))
      .filter((p): p is Participant => p !== undefined);

    const shuffledWinners = shuffle(winners);

    const nextRoundMatches: Match[] = [];
    for (let i = 0; i < shuffledWinners.length; i += 2) {
      nextRoundMatches.push({
        id: (lastRound.id + 1) * 100 + i / 2,
        participantIds: [shuffledWinners[i].id, shuffledWinners[i + 1]?.id ?? null],
        winnerId: null,
      });
    }
    
    const roundTitles: { [key: number]: string } = {
      2: "Final",
      4: "Semi-Finals",
      8: "Quarter-Finals",
    };
    
    const numCompetitorsInNextRound = nextRoundMatches.length * 2;
    const title = roundTitles[numCompetitorsInNextRound] ?? `Round ${rounds.length + 1}`;

    const nextRound: Round = {
      id: rounds.length,
      title: title,
      matches: nextRoundMatches,
    };
    
    setRounds(prevRounds => [...prevRounds, nextRound]);
  }, [appState, rounds, participants]);

  useEffect(() => {
    generateNextRound();
  }, [rounds, generateNextRound]);

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col items-center p-4">
      <header className="w-full text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          {tournamentTitle || 'Bracket Tournament Generator'}
        </h1>
      </header>
      <main className="w-full flex-grow flex items-center justify-center">
        {appState === AppState.SETUP && <SetupScreen onSetupComplete={handleSetupComplete} />}
        {appState === AppState.ENTRY && <EntryScreen numParticipants={numParticipants} onEntriesComplete={handleEntriesComplete} />}
        {(appState === AppState.TOURNAMENT || appState === AppState.FINISHED) && (
          <TournamentBracket rounds={rounds} participants={participants} onSelectWinner={handleSelectWinner} />
        )}
        {appState === AppState.FINISHED && winner && (
          <WinnerDisplay winner={winner} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}

export default App;
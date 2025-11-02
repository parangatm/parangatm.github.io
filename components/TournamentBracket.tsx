import React from 'react';
import { Round, Participant, Match } from '../types.ts';

interface MatchCardProps {
  match: Match;
  participants: Participant[];
  onSelectWinner: (matchId: number, winnerId: number) => void;
  isClickable: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, participants, onSelectWinner, isClickable }) => {
  const [p1Id, p2Id] = match.participantIds;

  const getParticipant = (id: number | null) => id === null ? null : participants.find(p => p.id === id);

  const participant1 = getParticipant(p1Id);
  const participant2 = getParticipant(p2Id);

  const getParticipantClasses = (participant: Participant | null | undefined, isWinner: boolean) => {
    let classes = 'px-4 py-3 rounded-md transition-all duration-300 w-full text-left relative overflow-hidden';
    if (match.winnerId !== null) {
      if (isWinner) {
        classes += ' font-bold bg-green-500/20 text-green-300 animate-[winner-pop_0.5s_ease-out]';
      } else {
        classes += ' text-slate-500 opacity-70';
      }
    } else if (isClickable && participant) {
      classes += ' cursor-pointer group hover:bg-purple-600/50';
    } else {
      classes += ' bg-slate-800';
    }
    return classes;
  };
  
  const createParticipantDiv = (participant: Participant | null | undefined) => {
    const isWinner = match.winnerId === participant?.id;
    return (
      <div
        className={getParticipantClasses(participant, isWinner)}
        onClick={() => isClickable && participant && onSelectWinner(match.id, participant.id)}
      >
        <span className="truncate">{participant?.name ?? 'TBD'}</span>
        {isClickable && participant && <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>}
      </div>
    );
  };

  return (
    <div className="bg-slate-800/50 rounded-lg shadow-lg w-64 backdrop-blur-sm border border-slate-700">
      <div className="flex flex-col gap-1 p-1">
        {createParticipantDiv(participant1)}
        {createParticipantDiv(participant2)}
      </div>
    </div>
  );
};


interface TournamentBracketProps {
  rounds: Round[];
  participants: Participant[];
  onSelectWinner: (matchId: number, winnerId: number) => void;
}

const TournamentBracket: React.FC<TournamentBracketProps> = ({ rounds, participants, onSelectWinner }) => {
  const latestRoundWithProgress = rounds.slice().reverse().find(r => r.matches.some(m => m.winnerId !== null))?.id ?? 0;
  const currentRoundId = rounds.find(r => r.matches.some(m => m.winnerId === null))?.id ?? latestRoundWithProgress;

  return (
    <div className="w-full">
      <div className="relative">
        <div className="flex items-start p-4 space-x-16 md:space-x-24 overflow-x-auto">
          {rounds.map(round => (
            <div key={round.id} className="flex flex-col justify-around min-h-full space-y-4 flex-shrink-0">
              <h3 className="text-xl font-bold text-cyan-300 text-center mb-4 sticky top-0 bg-slate-900/50 backdrop-blur-sm py-2 rounded-lg">{round.title}</h3>
              <div className="flex flex-col gap-12">
                  {round.matches.map(match => (
                  <MatchCard
                      key={match.id}
                      match={match}
                      participants={participants}
                      onSelectWinner={onSelectWinner}
                      isClickable={round.id === currentRoundId && match.winnerId === null}
                  />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TournamentBracket;
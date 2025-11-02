
import React from 'react';
import { Participant } from '../types.ts';
import { CrownIcon } from './icons.tsx';

const ConfettiPiece: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
    <div className="absolute w-2 h-4" style={style}></div>
);

const Confetti: React.FC = () => {
    const colors = ['#fde047', '#f97316', '#a855f7', '#22c55e', '#3b82f6'];
    const pieces = Array.from({ length: 150 }).map((_, i) => {
      const style = {
        left: `${Math.random() * 100}%`,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        transform: `rotate(${Math.random() * 360}deg)`,
        animation: `fall ${3 + Math.random() * 4}s ${Math.random() * 2}s linear forwards`,
      };
      return <ConfettiPiece key={i} style={style} />;
    });
  
    return <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">{pieces}</div>;
};

interface WinnerDisplayProps {
  winner: Participant;
  onReset: () => void;
}

const WinnerDisplay: React.FC<WinnerDisplayProps> = ({ winner, onReset }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="relative bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md text-center flex flex-col items-center overflow-hidden">
        <Confetti />
        <div className="relative z-10">
            <h2 className="text-xl font-semibold text-slate-400 mb-2">Tournament Champion</h2>
            <div className="flex items-center justify-center gap-4 my-4">
            <CrownIcon className="w-12 h-12 text-yellow-400" />
            <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
                {winner.name}
            </p>
            </div>
            <button
            onClick={onReset}
            className="mt-6 w-full px-4 py-2 bg-purple-600 rounded-md font-semibold hover:bg-purple-700 transition-colors"
            >
            Start New Tournament
            </button>
        </div>
        </div>
    </div>
  );
};

export default WinnerDisplay;
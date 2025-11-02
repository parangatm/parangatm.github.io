
import React, { useState } from 'react';

interface SetupScreenProps {
  onSetupComplete: (count: number, title: string) => void;
}

const participantOptions = [4, 8, 16, 32];

const SetupScreen: React.FC<SetupScreenProps> = ({ onSetupComplete }) => {
  const [selectedCount, setSelectedCount] = useState<number | null>(null);
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCount && title.trim()) {
      onSetupComplete(selectedCount, title.trim());
    }
  };

  return (
    <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-cyan-300">New Tournament</h2>
          <p className="text-slate-400 mb-4">First, give your tournament a name.</p>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g., Office Ping-Pong Championship"
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <p className="text-slate-400 mb-4">How many participants will compete?</p>
          <div className="grid grid-cols-2 gap-4">
            {participantOptions.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => setSelectedCount(option)}
                className={`p-4 rounded-lg text-xl font-semibold transform transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                  selectedCount === option
                    ? 'bg-purple-600 ring-purple-500'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <button
          type="submit"
          disabled={!selectedCount || !title.trim()}
          className="w-full px-4 py-3 bg-purple-600 rounded-md font-semibold hover:bg-purple-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
        >
          Create Tournament
        </button>
      </form>
    </div>
  );
};

export default SetupScreen;
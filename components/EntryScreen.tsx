
import React, { useState } from 'react';

interface EntryScreenProps {
  numParticipants: number;
  onEntriesComplete: (names: string[]) => void;
}

const EntryScreen: React.FC<EntryScreenProps> = ({ numParticipants, onEntriesComplete }) => {
  const [entries, setEntries] = useState<string[]>(Array(numParticipants).fill(''));

  const handleInputChange = (index: number, value: string) => {
    const newEntries = [...entries];
    newEntries[index] = value;
    setEntries(newEntries);
  };

  const allEntriesFilled = entries.every(entry => entry.trim() !== '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allEntriesFilled) {
      onEntriesComplete(entries);
    }
  };
  
  const fillDummyData = () => {
    const dummyEntries = Array.from({ length: numParticipants }, (_, i) => `Participant ${i + 1}`);
    setEntries(dummyEntries);
  };

  return (
    <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-lg">
      <h2 className="text-2xl font-bold mb-4 text-cyan-300 text-center">Enter Participants ({numParticipants})</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
            {entries.map((entry, index) => (
            <div key={index}>
                <label className="text-sm font-medium text-slate-400" htmlFor={`entry-${index}`}>
                Participant {index + 1}
                </label>
                <input
                id={`entry-${index}`}
                type="text"
                value={entry}
                onChange={e => handleInputChange(index, e.target.value)}
                className="mt-1 w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                />
            </div>
            ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
            type="button"
            onClick={fillDummyData}
            className="w-full px-4 py-2 bg-slate-600 rounded-md font-semibold hover:bg-slate-500 transition-colors"
            >
            Fill Dummy Data
            </button>
            <button
            type="submit"
            disabled={!allEntriesFilled}
            className="w-full px-4 py-2 bg-purple-600 rounded-md font-semibold hover:bg-purple-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
            >
            Generate Bracket
            </button>
        </div>
      </form>
    </div>
  );
};

export default EntryScreen;

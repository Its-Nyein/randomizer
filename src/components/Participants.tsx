import { FC, useState } from 'react';
import { MAX_PARTICIPANTS } from '../App';
import { capitalize } from '../utils/utils';
import { CiShuffle } from "react-icons/ci";
import { FaSortAlphaDown } from "react-icons/fa";

interface ParticipantsProps {
  handleAddName: (name: string) => void;
  handleRemoveName: (index: number) => void;
  shuffleNames: () => void;
  sortNames: () => void;
  names: string[];
}

export const Participants: FC<ParticipantsProps> = ({
  handleAddName,
  handleRemoveName,
  shuffleNames,
  sortNames,
  names,
}) => {
  const [participant, setParticipant] = useState('');
  const [error, setError] = useState('');

  const isMaxParticipantsReached = names.length >= MAX_PARTICIPANTS;
  const hasParticipants = names.length > 0;

  const validateInput = (name: string) => {
    const specialCharPattern = /[^a-zA-Z0-9 ]/;
    if (!name.trim()) {
      return 'Name cannot be empty.';
    }
    if (specialCharPattern.test(name)) {
      return 'Name cannot contain special characters.';
    }
    return '';
  };

  const handleAddParticipant = () => {
    const validationError = validateInput(participant);
    if (validationError) {
      setError(validationError);
    } else {
      handleAddName(participant);
      setParticipant('');
      setError('');
    }
  };

  return (
    <section className="p-6">
      <h2 className="text-xl font-bold mb-4">Add Participants</h2>
      <div className="flex justify-end gap-2 mb-4">
        <input
          disabled={isMaxParticipantsReached}
          type="text"
          placeholder="Enter a name"
          value={participant}
          onChange={(e) => setParticipant(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              handleAddParticipant();
            }
          }}
          className="p-3 w-48 md:w-72 border border-blue-500 rounded focus:outline-none shadow-sm placeholder:text-gray-400"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {isMaxParticipantsReached && (
          <p className="text-red-500 text-sm">Max participants reached.</p>
        )}
        <button
          disabled={isMaxParticipantsReached}
          onClick={handleAddParticipant}
          className="border border-[#01b4e4] text-black px-4 py-2 rounded-md cursor-pointer"
        >
          Add
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4">Participants</h2>
      <div className="flex justify-end gap-4 mb-4">
        <button
          onClick={shuffleNames}
          disabled={!hasParticipants}
          className="relative flex gap-1 border border-[#01b4e4] mb-3 p-2 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-[#01b4e4] -z-10 transform scale-x-0 group-hover:scale-x-100 transition-all duration-300 ease-in-out"></div>
          <CiShuffle className="group-hover:text-white" />
          <span className="group-hover:text-white transition-all duration-300 ease-in-out">
            Shuffle
          </span>
        </button>
        <button
          onClick={sortNames}
          disabled={!hasParticipants}
          className="relative flex gap-1 border border-[#01b4e4] mb-3 p-2 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-[#01b4e4] -z-10 transform scale-x-0 group-hover:scale-x-100 transition-all duration-300 ease-in-out"></div>
          <FaSortAlphaDown className="group-hover:text-white" />
          <span className="group-hover:text-white transition-all duration-200 ease-in-out">
            Sort
          </span>
        </button>
      </div>

      <ul>
        {names.map((name, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-gray-100 p-3 mb-2 rounded-lg shadow-sm"
          >
            <span className="font-semibold text-gray-700">{capitalize(name)}</span>
            <button
              onClick={() => handleRemoveName(index)}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 cursor-pointer"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

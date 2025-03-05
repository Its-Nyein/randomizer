import { Participants } from './components/Participants';
import { Wheel } from './components/wheel';
import { useState } from 'react';
import { Header } from './components/Header';

export const MAX_PARTICIPANTS = 18;

function App() {
  const [names, setNames] = useState<string[]>([]);

  const handleAddName = (name: string) => {
    if (names.length < MAX_PARTICIPANTS) {
      setNames([...names, name]);
    }
  };

  const handleRemoveName = (index: number) => {
    setNames(names.filter((_, i) => i !== index));
  };

  const shuffleNames = () => {
    const shuffledNames = [...names].sort(() => Math.random() - 0.5);
    setNames(shuffledNames);
  };

  const sortNames = () => {
    const sortedNames = [...names].sort((a, b) => a.localeCompare(b));
    setNames(sortedNames);
  };

  return (
    <>
      <Header />
      <main className="flex flex-col md:flex-row justify-around items-center gap-6 p-6">
        <div className="w-full flex justify-center mb-10">
          {/* <div className="w-[70vw] max-w-[300px] md:max-w-[500px]"> */}
            <Wheel participants={names} />
          </div>
        {/* </div> */}
        
        <div className="w-full">
          <Participants
            handleAddName={handleAddName}
            handleRemoveName={handleRemoveName}
            shuffleNames={shuffleNames}
            sortNames={sortNames}
            names={names}
          />
        </div>
      </main>
    </>
  );
}

export default App;
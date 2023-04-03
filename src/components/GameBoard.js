import React, { useState, useEffect } from 'react';
import Mole from './Mole';
import './GameBoard.css';

const GameBoard = () => {
  const [moles, setMoles] = useState([]);
  const [hashPower, setHashPower] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const initialMoles = [];
    for (let i = 0; i < 16; i++) {
      initialMoles.push({ id: i, active: false, whacked: false });
    }
    setMoles(initialMoles);
  }, []);
  
  useEffect(() => {
    if (timeLeft <= 0) {
      // End the game
      return;
    }
  
    const moleActivityInterval = setInterval(() => {
      console.log('Activating mole');
  
      // Randomly activate a mole
      const randomMole = Math.floor(Math.random() * moles.length);
  
      // Deactivate all moles except the randomly chosen one
      const newMoles = moles.map((mole, index) => ({
        ...mole,
        active: index === randomMole,
      }));
      setMoles(newMoles);
      
      console.log(`Activated mole ID: ${randomMole}`);
  
      // Adjust mole appearance duration
      setTimeout(() => {
        setMoles((prevMoles) =>
          prevMoles.map((mole, index) =>
            index === randomMole ? { ...mole, active: false } : mole
          )
        );
      }, 1500 - timeLeft * 2);
  
      console.log(`Deactivated mole ID: ${randomMole}`);
    }, 500);
  
    return () => clearInterval(moleActivityInterval);
  }, [moles, timeLeft]);
      

const handleMoleClick = (moleId, isActive) => {
if (!isActive) return;
const newMoles = moles.map((mole) =>
  mole.id === moleId && mole.active
    ? { ...mole, active: false, whacked: true }
    : mole
);
setMoles(newMoles);
setHashPower((prevHashPower) => prevHashPower + 7);

// Reset the whacked mole image after 2 seconds
setTimeout(() => {
  setMoles((prevMoles) =>
    prevMoles.map((mole) =>
      mole.id === moleId && mole.whacked
        ? { ...mole, whacked: false }
        : mole
    )
  );
}, 2000);
};

return (
<div className="game-board">
{moles.map((mole) => (
<Mole key={mole.id} mole={mole} onClick={handleMoleClick} />
))}
<div className="game-info">
<p>Hash Power: {hashPower}</p>
<p>Time Left: {timeLeft} seconds</p>
</div>
</div>
);
};

export default GameBoard;

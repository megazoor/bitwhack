import React from 'react';
import dirtImage from '../assets/dirt.png';
import moleImage from '../assets/mole.png';
import whackedImage from '../assets/whacked.png';

const Mole = ({ mole, onClick }) => {
  const handleClick = () => {
    onClick(mole.id, mole.active);
  };

  const currentMoleImage = mole.whacked ? whackedImage : moleImage;

  console.log(`Mole ID: ${mole.id}, Active: ${mole.active}, Whacked: ${mole.whacked}`);

  return (
    <div
      className={`mole-container ${mole.active ? 'active' : ''}`}
      onClick={handleClick}
    >
      {mole.active ? (
        <img src={currentMoleImage} alt="mole" className="mole" />
      ) : (
        <img src={dirtImage} alt="dirt mound" className="dirt" />
      )}
    </div>
  );
};

export default Mole;

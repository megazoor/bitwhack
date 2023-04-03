import React, { useState, useEffect } from 'react';
import Mole from './Mole';
import './GameBoard.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../components/ToastStyles.css';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';


const CustomToastContent = ({ message }) => (
  <div>
    <i className="fa fa-bolt" aria-hidden="true" style={{ marginRight: '8px' }} />
    {message}
  </div>
);

const GameOverToastContent = ({ message, onNewGameClick }) => (
  <div>
    <h1 style={{ fontSize: '52px' }}>{message}</h1>
    <button
      onClick={onNewGameClick}
      style={{
        backgroundColor: 'blue',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '10px 20px',
        marginTop: '20px',
        cursor: 'pointer'
      }}
    >
      New Game
    </button>
  </div>
);

const GameBoard = () => {
  const [moles, setMoles] = useState([]);
  const [hashPower, setHashPower] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameEnded, setGameEnded] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const initialMoles = [];
    for (let i = 0; i < 16;    i++) {
        initialMoles.push({ id: i, active: false, whacked: false });
      }
      setMoles(initialMoles);
    }, []);
  
    useEffect(() => {
        if (timeLeft <= 0 && !gameEnded) {
          setTimeLeft(0);
          setGameEnded(true); // Set the game status as ended
      
          // End the game
          toast(
            <GameOverToastContent
              message={`Hash Power: ${hashPower}`}
              onNewGameClick={resetGame}
            />,
            {
              position: toast.POSITION.TOP_CENTER,
              autoClose: false,
              closeOnClick: false,
              draggable: false,
            }
          );
        }
      }, [timeLeft, hashPower, gameEnded]); // Add gameEnded to the dependency array
      
  
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
      }, 500);    return () => clearInterval(moleActivityInterval);
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
  
      // Show toast notification with custom content
      toast.success(<CustomToastContent message="You earned +7 Hash Power!" />, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
      });
  
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
  
    const resetGame = () => {
        toast.dismiss();
        setHashPower(0);
        setTimeLeft(60);
        setGameEnded(false); // Reset the game status
        setMoles((prevMoles) =>
          prevMoles.map((mole) => ({ ...mole, active: false, whacked: false }))
        );
      };
      
  //...
return (
    <div className="container">
      <div className="game-info">
        <p>Hash Power: {hashPower}</p>
        <p>
          Time Left: {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, '0')}
        </p>
      </div>
      <div className="game-board">
<Canvas
  camera={{ position: [0, 0, 10], fov: 50, near: 0.1, far: 1000 }}
  style={{ width: '100vw', height: '100vh', background: 'yellow' }}
><Stars />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          {moles.map((mole) => (
            <Mole key={mole.id} mole={mole} onClick={handleMoleClick} />
          ))}
          <OrbitControls
  enabled={!timeLeft <= 0}
  enableZoom={false}
  enablePan={false}
  enableRotate={false}
/>

        </Canvas>
        <ToastContainer />
      </div>
    </div>
  );
  // Remove the extra closing brace here
  }
  
  export default GameBoard;
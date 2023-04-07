import React, { useState, useEffect } from 'react';
import Mole from './Mole';
import './GameBoard.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../components/ToastStyles.css';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import Modal from "./Modal";

const CustomToastContent = ({ message, currentBlockReward }) => (
  <div>
    <i
      className="fa fa-bolt"
      aria-hidden="true"
      style={{ marginRight: '8px', fontSize: '2rem' }}
    />
    <span style={{ fontSize: '2rem' }}>{message} ({currentBlockReward} BTC/block)</span>
  </div>
);


const GameOverToastContent = ({ message, round, onNewGameClick, totalBtcReward }) => (
  <div>
    <h1 style={{ fontSize: '3rem' }}>{message}</h1>
    {round < 3 && <p style={{ fontSize: '2rem' }}>Total BTC earned over 3 rounds: {totalBtcReward.toFixed(8)} BTC</p>}
    <button
      onClick={() => onNewGameClick(round + 1)}
      style={{
        backgroundColor: 'blue',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '10px 20px',
        marginTop: '20px',
        cursor: 'pointer',
        fontSize: '2rem'
      }}
    >
      {round < 3 ? 'Play Next Round' : 'New Game'}
    </button>
  </div>
);




const GameBoard = () => {
  const [moles, setMoles] = useState([]);
  const [btcReward, setBtcReward] = useState(0);
  const [hashPower, setHashPower] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [round, setRound] = useState(1);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [correctMoleId, setCorrectMoleId] = useState(null);
  const [missedMole, setMissedMole] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    show: false,
    title: "",
    message: "",
    buttonText: "",
    onClick: () => {},
  });
  const [currentBlockReward, setCurrentBlockReward] = useState(50);
  const [halveningCounter, setHalveningCounter] = useState(0);

  
  useEffect(() => {
    if (timeLeft % 30 === 0 && timeLeft !== 60) {
      setCurrentBlockReward((prevBlockReward) => prevBlockReward / 2);
      setHalveningCounter((prevHalveningCounter) => prevHalveningCounter + 1);

      toast(
        <CustomToastContent
          message={`Halvening! Block reward decreased by 50%.`}
          currentBlockReward={currentBlockReward / 2}
        />,
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        }
      );
    }
  }, [timeLeft]);

  useEffect(() => {
    if (round === 1) {
      setCurrentBlockReward(50);
    } else if (round === 2) {
      setCurrentBlockReward(25);
    } else if (round === 3) {
      setCurrentBlockReward(12.5);
    }
  }, [round]);
  


  useEffect(() => {
    const initialMoles = [];
    for (let i = 0; i < 16; i++) {
      initialMoles.push({ id: i, active: false, whacked: false, streak: false, color: 'base', streakColor: 'green' });
    }
    setMoles(initialMoles);
    
    setModalInfo({
      show: true,
      title: "Welcome to the Bitcoin Mining Game!",
      message: `In this game, you'll experience the excitement of mining Bitcoins through a fun and engaging whack-a-mole-style game. The moles represent blocks in the Bitcoin blockchain, and your goal is to successfully mine these blocks by whacking the active moles.
    
    In the real world, Bitcoin mining involves solving complex mathematical problems to validate and record transactions on the blockchain. Miners compete to solve these problems, and the first one to find a solution is rewarded with new Bitcoins. As you play this game, imagine yourself as a miner, and each successful hit represents solving a block and earning rewards.
    
    Scoring:
    - Each mole hit increases your hash power by 1 TH/s. (Hash power represents your mining capacity in the real world)
    - Every 5 consecutive hits reward you with 0.0007 BTC. (This simulates the rewards earned by miners for solving blocks)
    - Missing a mole or hitting an inactive mole decreases your hash power by 1 TH/s. (This represents the competition and difficulty in mining)
    
    The game has three rounds with increasing difficulty, and each round lasts for 60 seconds. At the end of each round, you'll see your total BTC reward. Good luck, and enjoy this playful take on the fascinating world of Bitcoin mining!`,
      buttonText: "Start",
      onClick: () => {
        setModalInfo({ ...modalInfo, show: false });
        startGame();
      },
    });
  }, []);
  
  useEffect(() => {
    if (gameStarted) {
      if (timeLeft <= 0) {
        setGameEnded(true);
        setGameStarted(false);
        setModalInfo({
          show: true,
          title: "Round Ended!",
          message: `Great job! You've finished this round with ${hashPower.toFixed(4)} TH/s hash power and ${btcReward.toFixed(8)} BTC rewards.
          
          Bitcoin mining can be a lucrative activity, but it's also competitive and requires a lot of resources. As you've experienced in this game, maintaining a high hash power and earning rewards takes skill and persistence. In real-world mining, miners invest in powerful hardware and join mining pools to increase their chances of successfully mining blocks.
          
          Are you ready to tackle the next round? Remember, each round gets more challenging, so stay focused and keep improving your mining skills!`,
          buttonText: "Start Next Round",
          onClick: () => {
            startNewGame(round + 1);
          },
        });
      } else {
        const timer = setInterval(() => {
          setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
        }, 1000);
  
        return () => clearInterval(timer);
      }
    }
  }, [gameStarted, timeLeft]);
  

  const startGame = () => {
    if (!gameStarted) {
      setGameStarted(true);
      toast.dismiss();
      spawnMole();
    }
  };
  

  const startNewGame = (newRound) => {
    setModalInfo({
      show: true,
      title: "Are you ready for the next round?",
      message: "The next round will be more difficult. Make sure you're prepared!",
      buttonText: "Start Next Round",
      onClick: () => {
        setModalInfo({ ...modalInfo, show: false });
        setRound(newRound);
        setHashPower(0);
        setTimeLeft(60);
        setGameEnded(false);
        setGameStarted(true);
        toast.dismiss();
        startGame();
      },
    });
  };
  
  const spawnMole = () => {
    if (gameEnded) return;

  setMoles((prevMoles) =>
    prevMoles.map((mole) =>
      mole.id === correctMoleId ? { ...mole, active: false, streak: false, streakColor: 'green' } : mole
    )
  );

  const randomMoleId = Math.floor(Math.random() * 16);
    let randomMoleTime;
    if (round === 1) {
      randomMoleTime = timeLeft <= 30 ? 750 : 1000;
    } else if (round === 2) {
      randomMoleTime = timeLeft <= 30 ? 500 : 800;
    } else if (round === 3) {
      randomMoleTime = timeLeft <= 30 ? 450 : 700;
    }
    setMoles((prevMoles) =>
      prevMoles.map((mole) =>
        mole.id === randomMoleId ? { ...mole, active: true, color: mole.streakColor } : mole
      )
    );
  
  setCorrectMoleId(randomMoleId);

  setTimeout(() => {
    setMoles((prevMoles) =>
      prevMoles.map((mole) =>
        mole.id === randomMoleId ? { ...mole, active: false } : mole
      )
    );
   
    spawnMole();
  }, randomMoleTime);
};

const handleMoleWhack = (mole) => {
  const id = mole.id;

  if (id === correctMoleId) {
    if (mole.whacked) {
      setHashPower((prevHashPower) => prevHashPower - 1);
    } else {
      setMoles((prevMoles) =>
        prevMoles.map((mole) =>
          mole.id === id ? { ...mole, whacked: true, streak: true, color: mole.streakColor } : mole
        )
      );
      setHashPower((prevHashPower) => prevHashPower + 1);
      setCurrentStreak((prevStreak) => prevStreak + 1);
    }
  } else {
    setMoles((prevMoles) =>
      prevMoles.map((mole) =>
        mole.id === id
          ? { ...mole, whacked: true, streak: false, active: currentStreak > 0, color: mole.active ? mole.streakColor : 'yellow' }
          : mole
      )
    );
    setHashPower((prevHashPower) => prevHashPower - 1);
    setCurrentStreak(0);
    setMissedMole(true);
  }
  setTimeout(() => {
    setMoles((prevMoles) =>
      prevMoles.map((mole) =>
        mole.id === id ? { ...mole, whacked: false, color: mole.active ? mole.streakColor : 'base' } : mole
      )
    );
  }, 500);
};

  
  // ...
  useEffect(() => {
    if (currentStreak === 5) {
      setBtcReward((prevBtcReward) => prevBtcReward + currentBlockReward);
      setCurrentStreak(0);
      toast.dismiss();
      toast(
      <CustomToastContent message={`Block Reward! +${currentBlockReward.toFixed(8)} BTC.`} currentBlockReward={currentBlockReward} />,
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        }
      );
  
      // Change the color of all moles with a streak to pink
      setMoles((prevMoles) =>
        prevMoles.map((mole) => {
          if (mole.streak) {
            return { ...mole, color: 'pink', streakColor: 'pink' };
          } else {
            return mole;
          }
        })
      );
    }
  }, [currentStreak, currentBlockReward]);
  
  
  
  
  // ...

  return (
    <div className="container">
      <div className="game-info">
      <p>Hash Power: {hashPower.toFixed(4)} TH/s | BTC Reward: {btcReward.toFixed(8)} BTC</p>
      <p>Current Block Reward: {currentBlockReward.toFixed(8)} BTC</p>
      <p>
        Time Until Halvening {Math.floor(timeLeft / 60)}:
        {(timeLeft % 60).toString().padStart(2, '0')}
      </p>
      <p>Halvening: {halveningCounter}</p>
      <p>Current Streak: {currentStreak}</p>
    </div>
      <div className="game-board">
        <Canvas
          camera={{
            position: [0, 0, 10],
            fov: 50,
            near: 0.1,
            far: 1000,
          }}
          style={{ width: '100vw', height: '100vh', background: 'black' }}
        >
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.6}
              luminanceSmoothing={0.5}
              intensity={1.5}
            />
          </EffectComposer>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          {moles.map((mole) => (
            <Mole
              key={mole.id}
              mole={mole}
              onClick={handleMoleWhack} // Change this line
            />
          ))}
          <OrbitControls
            enabled={timeLeft > 0}
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
        </Canvas>
        <ToastContainer />
      </div>
      <Modal
      show={modalInfo.show}
      title={modalInfo.title}
      message={modalInfo.message}
      buttonText={modalInfo.buttonText}
      onClick={modalInfo.onClick}
      onClose={() => setModalInfo({ ...modalInfo, show: false })}
    />
    </div>
  );
};

export default GameBoard;
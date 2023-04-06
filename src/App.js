import React from 'react';
import './App.css';
import GameBoard from './components/GameBoard';

function App() {
  return (
    <div className="App">
      <div class="logo">      
        <span class="roboto">BITWHACK</span>
        <span> by </span>
        <span class="fugaz">MARATHON</span>
      </div>

      <GameBoard />
    </div>
  );
}

export default App;

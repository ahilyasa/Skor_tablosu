import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [mode, setMode] = useState(null);
  const [playerNames, setPlayerNames] = useState([]);
  const [nameInputs, setNameInputs] = useState([]);
  const [scores, setScores] = useState([]);
  const [newScores, setNewScores] = useState([]);

  // Sayfa açılırken localStorage'dan verileri yükle
  useEffect(() => {
    const saved = localStorage.getItem('scoreData');
    if (saved) {
      const { mode, playerNames, nameInputs, scores } = JSON.parse(saved);
      setMode(mode);
      setPlayerNames(playerNames);
      setNameInputs(nameInputs);
      setScores(scores);
      setNewScores(Array(playerNames.length).fill(''));
    }
  }, []);

  // state değiştikçe localStorage güncelle
  useEffect(() => {
    if (mode && playerNames.length > 0) {
      localStorage.setItem(
        'scoreData',
        JSON.stringify({ mode, playerNames, nameInputs, scores })
      );
    }
  }, [mode, playerNames, nameInputs, scores]);

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    const numPlayers = selectedMode === 'single' ? 4 : 2;
    setNameInputs(Array(numPlayers).fill(''));
    setNewScores(Array(numPlayers).fill(''));
  };

  const handleNameChange = (index, name) => {
    const updatedNames = [...nameInputs];
    updatedNames[index] = name;
    setNameInputs(updatedNames);
  };

  const handleContinue = () => {
    setPlayerNames(nameInputs);
  };

  const handleScoreChange = (index, value) => {
    const updatedScores = [...newScores];
    updatedScores[index] = value;
    setNewScores(updatedScores);
  };

  const handleAddScores = () => {
    const parsedScores = newScores.map(score => {
      const n = parseInt(score, 10);
      return isNaN(n) ? 0 : n;
    });
    setScores(prev => [...prev, parsedScores]);
    setNewScores(Array(playerNames.length).fill(''));
  };

  const handleReset = () => {
    localStorage.removeItem('scoreData');
    setMode(null);
    setPlayerNames([]);
    setNameInputs([]);
    setScores([]);
    setNewScores([]);
  };

  const calculateTotals = () => {
    const totals = Array(playerNames.length).fill(0);
    scores.forEach(row => {
      row.forEach((score, i) => {
        totals[i] += score;
      });
    });
    return totals;
  };

  const getTotalClasses = (totals) => {
    const max = Math.max(...totals);
    const min = Math.min(...totals);

    return totals.map((total) => {
      if (totals.every(t => t === total)) return 'equal';
      if (total === max) return 'high';
      if (total === min) return 'low';
      return '';
    });
  };

  if (!mode) {
    return (
      <div className="container">
        <h1>Oyun Modunu Seçin</h1>
        <button onClick={() => handleModeSelect('single')}>Tekli (4 Oyuncu)</button>
        <button onClick={() => handleModeSelect('double')}>Eşli (2 Takım)</button>
      </div>
    );
  }

  if (playerNames.length === 0) {
    return (
      <div className="container">
        <h1>Oyuncu İsimlerini Girin</h1>
        {nameInputs.map((name, i) => (
          <input
            key={i}
            type="text"
            placeholder={`Oyuncu ${i + 1}`}
            value={name}
            onChange={e => handleNameChange(i, e.target.value)}
          />
        ))}
        <button onClick={handleContinue}>Devam Et</button>
      </div>
    );
  }

  const totals = calculateTotals();
  const totalClasses = getTotalClasses(totals);

  return (
    <div className="container">
      <h1>Skor Tablosu</h1>

      <div>
        <h3>Yeni Skor Ekle</h3>
        {playerNames.map((name, i) => (
          <input
            key={i}
            type="number"
            placeholder={`${name} skoru`}
            value={newScores[i]}
            onChange={e => handleScoreChange(i, e.target.value)}
          />
        ))}

        {/* Ekle ve Bitir butonları yan yana */}
        <div style={{ marginTop: '10px' }}>
          <button onClick={handleAddScores} style={{ marginRight: '10px' }}>
            Ekleme
          </button>

          <button
            onClick={handleReset}
            style={{
              backgroundColor: 'red',
              color: 'white',
              padding: '10px 20px',
              fontSize: '16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Bitir
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            {playerNames.map((name, i) => (
              <th key={i}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {scores.map((row, rIndex) => (
            <tr key={rIndex}>
              {row.map((score, cIndex) => (
                <td key={cIndex}>{score}</td>
              ))}
            </tr>
          ))}
          <tr>
            {totals.map((total, i) => (
              <td key={i} className={totalClasses[i]}>
                <b>{total}</b>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;

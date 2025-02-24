import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRepeat, faX, faO } from '@fortawesome/free-solid-svg-icons';

function Square({ value, onSquareClick, backgroundColor, height, inlineSize, fontSize, isBold, fontColor, boxShadow, icon }) {
  const iconColor = value === 'X' ? '#30C4BE' : value === 'O' ? '#F2B238' : fontColor;

  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={{
        backgroundColor: backgroundColor,
        blockSize: height,
        inlineSize: inlineSize,
        fontSize: fontSize,
        fontWeight: isBold ? "bold" : "500",
        color: iconColor,
        boxShadow: boxShadow,
      }}
    >
      {icon ? <FontAwesomeIcon icon={icon} /> : (value === 'X' ? <FontAwesomeIcon icon={faX} /> : value === 'O' ? <FontAwesomeIcon icon={faO} /> : null)}
    </button>
  );
}

function Logo({ fontColor, icon, fontWeight }) {
  return <div className='logo' style={{
    color: fontColor,
    fontWeight: fontWeight
  }}>
    {icon && <FontAwesomeIcon icon={icon} />}
  </div>
}

function Status({ value, onSquareClick, backgroundColor, height, inlineSize, fontSize, isBold, fontColor, boxShadow, icon, display }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={{
        backgroundColor: backgroundColor,
        blockSize: height,
        inlineSize: inlineSize,
        fontSize: fontSize,
        fontWeight: isBold ? "bold" : "500",
        color: fontColor,
        boxShadow: boxShadow,
        display: display,
      }}
    >
      {icon && <FontAwesomeIcon icon={icon} />}
      {value}
    </button>
  );
}

function ScoreWrapper({ children, backgroundColor, icon }) {
  return (
    <div
      className="score-wrapper"
      style={{
        backgroundColor: backgroundColor,
      }}
    >
      {icon && <FontAwesomeIcon icon={icon} />}
      {children}
    </div>
  );
}

function Score({ value, backgroundColor, fontSize, fontWeight, marginBlockStart }) {
  return (
    <div
      className="score"
      style={{
        backgroundColor: backgroundColor,
        fontSize: fontSize,
        fontWeight: fontWeight,
        marginBlockStart: marginBlockStart,
      }}
    >
      {value}
    </div>
  );
}

function Board({ xIsNext, squares, onPlay, onReset, scores }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status = null;

  if (winner === 'draw') {
    status = 'TIE'
  }
  else if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = (xIsNext ? 'X' : 'O') + ' TURN';
  }

  return (
    <>
      <div className='status-upper'>
        <div className='logo-wrapper'>
          <Logo icon={faX} fontColor='#30C4BE' />
          <Logo icon={faO} fontColor='#F2B238' />
        </div>
        <Status value={status}
          backgroundColor="#1F3540" height="40px" fontSize="1rem" isBold={true} fontColor="#A8BEC9" boxShadow="0px 3px black" />
        <Status icon={faRepeat} onSquareClick={onReset}
          backgroundColor="#A8BEC9" height="40px" inlineSize="40px" fontSize="1rem" isBold={true} fontColor="#1F3540" boxShadow="0px 3px black" />
      </div>
      <div className='board'>
        {squares.map((square, index) => (
          <Square
            key={index}
            value={square}
            onSquareClick={() => handleClick(index)}
            backgroundColor="#1F3540"                        
            isBold={true}
            boxShadow="0px 6px black"
          />
        ))}
      </div>
      <div className='status-bottom'>
        <ScoreWrapper backgroundColor="#30C4BE" blockSize="70px"  >
          <Score value={'X'} marginBlockStart='10px' />
          <Score value={scores.x} fontWeight='Bold' fontSize="24px" />
        </ScoreWrapper>
        <ScoreWrapper backgroundColor="#A8BEC9" blockSize="70px" fontSize="15px" >
          <Score value={'TIES'} marginBlockStart='10px' />
          <Score value={scores.ties} fontWeight='Bold' fontSize="24px" />
        </ScoreWrapper>
        <ScoreWrapper value={'O = ' + scores.o} backgroundColor="#F2B238" blockSize="70px" fontSize="15px" >
          <Score value={'O'} marginBlockStart='10px' />
          <Score value={scores.o} fontWeight='Bold' fontSize="24px" />
        </ScoreWrapper>
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [scores, setScores] = useState({ x: 0, o: 0, ties: 0 });
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const updateScores = (winner) => {
    if (winner === 'draw') {
      setScores((prevScores) => ({ ...prevScores, ties: prevScores.ties + 1 }));
    }
    else if (winner === 'X') {
      setScores((prevScores) => ({ ...prevScores, x: prevScores.x + 1 }));
    } else if (winner === 'O') {
      setScores((prevScores) => ({ ...prevScores, o: prevScores.o + 1 }));
    }
  };

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handlePlay(nextSquares) {
    const winner = calculateWinner(nextSquares);
    if (winner) {
      updateScores(winner);
    }

    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((squares, move) => {
    let description = '';
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Click on board to game start';
    }
    return (
      <li key={move}>
        <button className='redo-button' onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} onReset={resetGame} scores={scores} />
      </div>
      <div className='game-info'>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  if (squares.every((square) => square !== null)) {
    return 'draw';
  }

  return null;
}
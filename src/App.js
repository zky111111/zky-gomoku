import { useState, useEffect } from "react";
import "./styles.css";

function Square({ value, onSquareClick, disabled }) {
  return (
    <button className="square" onClick={onSquareClick} disabled={disabled}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, winner }) {
  function handleClick(i) {
    if (winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const boardSize = 15;
  const rows = [];
  for (let i = 0; i < boardSize; i++) {
    const rowSquares = [];
    for (let j = 0; j < boardSize; j++) {
      rowSquares.push(
        <Square
          key={i * boardSize + j}
          value={squares[i * boardSize + j]}
          onSquareClick={() => handleClick(i * boardSize + j)}
          disabled={!!winner}
        />
      );
    }
    rows.push(
      <div className="board-row" key={i}>
        {rowSquares}
      </div>
    );
  }

  return (
    <>
      {winner && <div className="status">胜者：{winner}</div>}
      {rows}
    </>
  );
}

export default function Game() {
  const boardSize = 15;
  const [history, setHistory] = useState([
    Array(boardSize * boardSize).fill(null),
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const [winnerMessage, setWinnerMessage] = useState("");
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const winner = calculateWinner(currentSquares);

  useEffect(() => {
    if (winner) {
      alert(`游戏结束，${winner} 获胜！`);
      setWinnerMessage(`${winner} 获胜！`);
    }
  }, [winner]);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "转到第 " + move + " 步";
    } else {
      description = "返回游戏开始";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          winner={winner}
        />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>

      {winner && <div className="winner-message">{winnerMessage}</div>}
    </div>
  );
}

function calculateWinner(squares) {
  const boardSize = 15;
  const directions = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: -1 },
  ];

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const current = squares[i * boardSize + j];
      if (current) {
        for (const { x, y } of directions) {
          let count = 1;
          let k = 1;
          while (
            i + k * x >= 0 &&
            i + k * x < boardSize &&
            j + k * y >= 0 &&
            j + k * y < boardSize
          ) {
            if (squares[(i + k * x) * boardSize + (j + k * y)] === current) {
              count++;
            } else {
              break;
            }
            k++;
          }
          k = 1;
          while (
            i - k * x >= 0 &&
            i - k * x < boardSize &&
            j - k * y >= 0 &&
            j - k * y < boardSize
          ) {
            if (squares[(i - k * x) * boardSize + (j - k * y)] === current) {
              count++;
            } else {
              break;
            }
            k++;
          }

          if (count >= 5) {
            return current;
          }
        }
      }
    }
  }
  return null;
}

import { useState } from 'react';

function Square({ value, impact, onSquareClick }) {
	return (
		<button style={impact ? {backgroundColor:'blue'} : null} className="square" onClick={onSquareClick}>
			{ value }
		</button>
	);
}

function Board({ xIsNext, squares, onPlay }) {
	function handleClick(i){
		if(squares[i] || calculateWinner(squares))
			return;

		const nextSquares = squares.slice();
		if(xIsNext){
			nextSquares[i] = 'X';
		}else{
			nextSquares[i] = 'O';
		}
		onPlay(nextSquares);
	}

	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];
	function calculateWinner(squares) {
		for (let i = 0; i < lines.length; i++) {
		  const [a, b, c] = lines[i];
		  if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		  }
		}
		return null;
	}
	function calculateWinningPath(squares) {
		for (let i = 0; i < lines.length; i++) {
			const [a, b, c] = lines[i];
			if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
				return lines[i];
			}
		}
		return [];
	}

	const winner = calculateWinner(squares);
	const winningPath = calculateWinningPath(squares)
	let status;
	if(winner) {
		status = 'winner: ' + winner;
	} else {
		status = 'Next Player: ' + (xIsNext ? 'X' : 'O');
	}
	
  	return (
		<>
			<div className="status">{status}</div>
			<div className="board-row">
				<Square value={squares[0]} impact={winningPath.includes(0)} onSquareClick={() => handleClick(0)}/>
				<Square value={squares[1]} impact={winningPath.includes(1)} onSquareClick={() => handleClick(1)}/>
				<Square value={squares[2]} impact={winningPath.includes(2)} onSquareClick={() => handleClick(2)}/>
			</div>
			<div className="board-row">
				<Square value={squares[3]} impact={winningPath.includes(3)} onSquareClick={() => handleClick(3)}/>
				<Square value={squares[4]} impact={winningPath.includes(4)} onSquareClick={() => handleClick(4)}/>
				<Square value={squares[5]} impact={winningPath.includes(5)} onSquareClick={() => handleClick(5)}/>
			</div>
			<div className="board-row">
				<Square value={squares[6]} impact={winningPath.includes(6)} onSquareClick={() => handleClick(6)}/>
				<Square value={squares[7]} impact={winningPath.includes(7)} onSquareClick={() => handleClick(7)}/>
				<Square value={squares[8]} impact={winningPath.includes(8)} onSquareClick={() => handleClick(8)}/>
			</div>			
		</>
	);
}

export default function Game() {
	const [history, setHistory] = useState([Array(9).fill(null)]);
	const [currentMove, setCurrentMove] = useState(0);
	const xIsNext = currentMove % 2 === 0;
	const currentSquares = history[currentMove];
	
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
		if (move === currentMove) {
			description = '당신은 ' + currentMove + '번째 순서에 있습니다…';
		} else if (move > 0) {
			description = 'Go to move #' + move;
		} else {
			description = 'Go to game start';
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
			<Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
		</div>
		<div className="game-info">
			<ol>{moves}</ol>
		</div>
	  </div>
	);
  }
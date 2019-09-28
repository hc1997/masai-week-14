import React from "react";
import ReactDOM from "react-dom";
import RubberBand from 'react-reveal/RubberBand';
import "./index.css";



function Square(props) {
  return (
    <button
      className={"square " + (props.isWinning ? "square--winning" : null)}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        isWinning={this.props.winningSquares.includes(i)}
        key={"square " + i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  outputsquare(n) {
    let squares = [];
    for (let i = n; i < n + 3; i++) {
      squares.push(this.renderSquare(i));
    }
    return squares;
  }

  renderRows(i) {
    return <div className="board-row" style={{color:"red"}}>{this.outputsquare(i)}</div>;
    
}

  render() {
    return (
      <div>
        {this.renderRows(0)}
        {this.renderRows(3)}
        {this.renderRows(6)}
      </div>
    );
  }
}

class Game extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      previous: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepnew: 0,
      xnext: true,
      descending: true
    };
  }

  handleClick(i) {
    const locations = [
      [1, 1],
      [2, 1],
      [3, 1],
      [1, 2],
      [2, 2],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3]
    ];
    const previous = this.state.previous.slice(0, this.state.stepnew + 1);
    // console.log(previous)
    const current = previous[previous.length - 1];
    // console.log(current)
    const squares = current.squares.slice();
    // console.log(squares)
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xnext ? "X" : "O";
    this.setState({
      previous: previous.concat([
        {
          squares: squares,
          location: locations[i]
        }
      ]),
      stepnew: previous.length,
      xnext: !this.state.xnext
    });
  }

  nextpos(step) {
    this.setState({
      stepnew: step,
      xnext: step % 2 === 0
    });
  }

  render() {
    const previous = this.state.previous;
    const current = previous[this.state.stepnew];
    const winner = calculateWinner(current.squares);
    const moves = previous.map((step, move) => {
      const desc = move
        ? "Undo " + move 
        : "Restart";
      return (
        <li key={move}>
          <button onClick={() => this.nextpos(move)}>
            {move == this.state.stepnew ? <b>{desc}</b> : desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner:" + winner.player }
     else if (!current.squares.includes(null)) {
      status = "draw";
    }
     else {
      status = "Next player: " + (this.state.xnext ? "X" : "O");
    }

    return (
        <React.Fragment>
           <RubberBand><h1 style ={{textAlign:"center",color:"darkblue" }}>TIC TAC TOE</h1></RubberBand> 
      <div className="game">
        <div className="game-board">
          <Board
            winningSquares={winner ? winner.line : []}
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
          
        </div>
        <div className="game-info">
            <div style={{fontSize:"30px"}}>{status}</div>
          <ol>{this.state.descending ? moves : moves.reverse()}</ol>
        </div>
      </div>
      </React.Fragment>
    );
  }
}


ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

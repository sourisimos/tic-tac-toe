import React,{ useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'


// ========== Création du composant Square

const Square = (props) => {
  return (
      <button 
      className="square" 
      onClick={props.onClick}
      >
        {props.value}  
      </button>
    ); // on met dans la case la valeur du jour qui a cliqué dessus (pour la premiere fois)
}



// ========== Définition du plateau de jeu

const Board = (props) => {
  
  // On construit le carré avec les properties correspondantes et on le lit à uen valeur de boardGame
  const renderSquare = (i) => {
    return  <Square value={props.gameBoard[i]} onClick={() => props.onClick(i)}/>
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
        <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}




// ========== Création du jeu 

const Game = () => {

  const GameState = (board,isXTurn) => ({
    board,
    isXTurn,
  });

  // ==== Etat initial
  let actualGameState = GameState(Array(9).fill(null), true);
  const [history, setHistory] = useState([GameState(Array(9).fill(null), true)]);
  const [actualMove, setActualMove] = useState(0)
  // console.log('de base')
  // console.log(history)


  // Action lorsqu'on clique
  const handleClick = (i) => {

    const [currentPlayingState,currentPlayingHistory] = replaceState(history, actualMove);

    if (isImpossible(currentPlayingState.board,i)) {
      return; 
    } 
      
      [currentPlayingState.board[i],currentPlayingState.isXTurn] = play(currentPlayingState,i);
      const currentHistory = actualiseHistory(currentPlayingHistory, currentPlayingState);

      setHistory(currentHistory);
      setActualMove(actualMove+1);
      // console.log('oui')
      // console.log(history)
    
  }

  // === création attribution du nouveau tableau de jeu et historique selon le move
  const replaceState = (history, actualMove) => {
    // console.log('historique slicé')
    // console.log(history.slice(0,actualMove+1));
    console.log(history[actualMove])
    console.log({...history[actualMove]})
    return [JSON.parse(JSON.stringify(history[actualMove])),history.slice(0,actualMove+1)];
  }

  // === Evalution de la possibilité de jeu 
  const isImpossible = (board,i) => {
    return (calculateWinner(board) || board[i]);
  }

  // === Modification de la case de l'obejet concernée
  const play = (gameState, i) => {
    return [gameState.isXTurn ? 'X' : 'O',!gameState.isXTurn];
  }

  // === Modification de la variable historique 
  const actualiseHistory = (history, newState) => {
    // console.log('history : ')
    // console.log(history)
    // console.log('newState : ')
    // console.log(newState)
    return [...history, newState];

  }

  // création de la liste historique intéractive : 
  const moves = history.map((_, move) => {
    const desc = (move ?
      'Action #'+ move :
      'Start a new game') 
    return (<li key= {move}>
              <button onClick={() => {jumpTo(move)}}>{desc}</button>
            </li>
            )
  })

  // modification de move pour pouvoir se trouver dans le bon state
  const jumpTo = (move) => {
    setActualMove(move)
  }

  // on actualise l'état du jeu à l'objet en palce move dans l'historique
  actualGameState = history[actualMove];

  // ========== Evaluation de la victoire, on retourne le gagnant si il y en a un, et null sinon ("vaut" false)
  const calculateWinner = (board) => {
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
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null; //null vaut false et un string vaut true
  }

  //=== on actualise le statue
  const status = 
    calculateWinner(actualGameState.board) ? 
    'winner : '+ calculateWinner(actualGameState.board) :
    (actualGameState.isXTurn ? 'X ' : 'O ')+ 'have to play';



  return (
    <div className="game">
      <div className="game-board">
        <Board 
        gameBoard={actualGameState.board}
        onClick={(i) => handleClick(i)}/>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
        <ol>{}</ol>
      </div>
    </div>
  );
}

// ========= TEST

// const a = [[1,2,3],[4],[5,6]];
// let elementDeA = a[1][0];
// let copieA = a.slice();
// //let copieElementDeA = a[1][0].slice();
// let elementCopie = copieA[1][0];
// //copieElementDeA = 9;
// elementDeA = 8;
// elementCopie = 7
// console.log('a : '+a+' elementDeA : '+elementDeA+' elementCopie : '+elementCopie+' a apres : '+a)





// ========== Intégration en HTML 

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

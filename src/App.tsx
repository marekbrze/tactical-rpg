import { useReducer } from 'react';
import { gameReducer, createInitialState } from './reducer';
import Board from './components/Board';
import HUD from './components/HUD';
import './App.css';

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);

  const winnerName =
    state.winner === 'skejci' ? 'SKEJCI' : state.winner === 'dresy' ? 'DRESY' : null;

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">SKEJCI vs DRESY</h1>
        <p className="app__subtitle">Osiedle Taktyczne — Mechanika Walki</p>
      </header>

      <main className="app__main">
        <Board state={state} dispatch={dispatch} />
        <HUD state={state} dispatch={dispatch} />
      </main>

      {state.winner && (
        <div className="win-overlay" onClick={() => window.location.reload()}>
          <div className="win-overlay__box">
            <div className={`win-overlay__winner win-overlay__winner--${state.winner}`}>
              {winnerName}
            </div>
            <div className="win-overlay__text">wygrywają osiedle!</div>
            <div className="win-overlay__restart">[ kliknij aby zagrać ponownie ]</div>
          </div>
        </div>
      )}
    </div>
  );
}

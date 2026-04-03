import type { GameState, GameAction, Figure } from '../types';
import './HUD.css';

interface HUDProps {
  state: GameState;
  dispatch: (action: GameAction) => void;
}

export default function HUD({ state, dispatch }: HUDProps) {
  const selected: Figure | undefined = state.figures.find(
    (f) => f.id === state.selectedFigureId,
  );

  const teamName = state.currentTeam === 'skejci' ? 'SKEJCI' : 'DRESY';
  const teamClass = `hud__team hud__team--${state.currentTeam}`;

  const phaseHint = () => {
    if (!selected) return 'Wybierz figurę';
    if (state.phase === 'selected' && !selected.hasMoved) return 'Ruch lub atak';
    if (state.phase === 'moved') return 'Atak lub zakończ turę';
    return '';
  };

  return (
    <div className="hud">
      <div className="hud__left">
        <div className={teamClass}>TURA: {teamName}</div>
        <div className="hud__hint">{phaseHint()}</div>
      </div>

      {selected && (
        <div className="hud__figure-info">
          <div className="hud__figure-name">{selected.name}</div>
          <div className="hud__figure-hp">
            <div
              className="hud__hp-fill"
              style={{ width: `${(selected.hp / selected.maxHp) * 100}%` }}
            />
            <span className="hud__hp-text">{selected.hp}/{selected.maxHp}</span>
          </div>
        </div>
      )}

      <div className="hud__log">
        {state.log
          .slice(-3)
          .reverse()
          .map((entry, i) => (
            <div key={i} className={`hud__log-entry${i === 0 ? ' hud__log-entry--latest' : ''}`}>
              {entry}
            </div>
          ))}
      </div>

      <button
        className="hud__end-turn"
        onClick={() => dispatch({ type: 'END_TURN' })}
      >
        ZAKOŃCZ TURĘ
      </button>
    </div>
  );
}

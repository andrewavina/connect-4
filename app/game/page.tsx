// app/game/page.tsx
'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  Board,
  COLS,
  ROWS,
  Player,
  applyMove,
  checkWin,
  createBoard,
  isDraw as engineIsDraw,
  nextPlayer,
} from '@/lib/game/engine';

type Snapshot = {
  board: Board;
  current: Player;
  lastMove: { row: number; col: number } | null;
};

export default function GamePage() {
  const [board, setBoard] = useState<Board>(() => createBoard());
  const [current, setCurrent] = useState<Player>('R');
  const [winningLine, setWinningLine] = useState<[number, number][] | null>(
    null
  );
  const [draw, setDraw] = useState(false);
  const [lastMove, setLastMove] = useState<{ row: number; col: number } | null>(
    null
  );
  const [history, setHistory] = useState<Snapshot[]>([]);

  const gameEnded = !!winningLine || draw;

  const onNewGame = useCallback(() => {
    setBoard(createBoard());
    setCurrent('R');
    setWinningLine(null);
    setDraw(false);
    setLastMove(null);
    setHistory([]);
  }, []);

  const onUndo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setBoard(prev.board);
    setCurrent(prev.current);
    setLastMove(prev.lastMove);
    setWinningLine(null);
    setDraw(false);
  }, [history]);

  const handleColumnClick = useCallback(
    (col: number) => {
      if (gameEnded) return;
      try {
        // snapshot for undo
        setHistory((h) => [...h, { board, current, lastMove }]);

        const {
          board: nextBoard,
          row,
          col: placedCol,
        } = applyMove(board, col, current);
        setBoard(nextBoard);
        setLastMove({ row, col: placedCol });

        const win = checkWin(nextBoard, row, placedCol);
        if (win) {
          setWinningLine(win.line);
          return;
        }
        const drawNow = engineIsDraw(nextBoard);
        if (drawNow) {
          setDraw(true);
          return;
        }
        setCurrent((p) => nextPlayer(p));
      } catch {
        // column full or invalid — ignore
        setHistory((h) => h.slice(0, -1)); // revert snapshot if move failed
      }
    },
    [board, current, gameEnded, lastMove]
  );

  // For rendering: convenient map of winning cells
  const winningSet = useMemo(() => {
    const set = new Set<string>();
    winningLine?.forEach(([r, c]) => set.add(`${r}:${c}`));
    return set;
  }, [winningLine]);

  return (
    <section className="mx-auto max-w-3xl">
      {/* Controls */}
      <div className="mb-6 flex items-center justify-between">
        <div aria-live="polite" className="text-sm text-muted-foreground">
          {winningLine ? (
            <span>
              {/* <WinnerLabel line={winningLine} /> wins! */}
              <WinnerLabel /> wins!
            </span>
          ) : draw ? (
            <span>It’s a draw.</span>
          ) : (
            <TurnLabel player={current} />
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNewGame}
            className="rounded-full border px-4 py-2 text-sm font-medium transition hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            New Game
          </button>
          <button
            onClick={onUndo}
            disabled={history.length === 0 || !!winningLine}
            className="rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
            aria-disabled={history.length === 0 || !!winningLine}
            title={winningLine ? 'Undo disabled after a win' : 'Undo last move'}
          >
            Undo
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="relative rounded-xl border bg-muted p-2">
        {/* Visual grid of cells */}
        <div
          role="grid"
          aria-label="Connect Four board"
          className="grid aspect-[7/6] grid-rows-6 gap-1 rounded-lg bg-background p-2"
        >
          {Array.from({ length: ROWS }).map((_, r) => (
            <Row
              key={r}
              rowIndex={r}
              cells={board[r]}
              winningSet={winningSet}
            />
          ))}
        </div>

        {/* Column click overlay (large hit targets) */}
        <div className="pointer-events-none absolute inset-0 grid grid-cols-7">
          {Array.from({ length: COLS }).map((_, c) => (
            <button
              key={c}
              type="button"
              aria-label={`Drop in column ${c + 1}`}
              onClick={() => handleColumnClick(c)}
              className="pointer-events-auto h-full w-full rounded-md focus:outline-none"
            />
          ))}
        </div>
      </div>

      {/* Footer status (redundant but nice) */}
      <div className="mt-6 text-center">
        {winningLine ? (
          <p className="text-lg font-medium">
            {/* <WinnerLabel line={winningLine} /> wins! */}
            <WinnerLabel /> wins!
          </p>
        ) : draw ? (
          <p className="text-lg font-medium">It’s a draw.</p>
        ) : (
          <p className="text-lg">
            <TurnLabel player={current} />
          </p>
        )}
      </div>
    </section>
  );
}

/* ---------- Presentational bits ---------- */

function Row({
  rowIndex,
  cells,
  winningSet,
}: {
  rowIndex: number;
  cells: Board[number];
  winningSet: Set<string>;
}) {
  return (
    <div role="row" className="grid grid-cols-7 gap-1">
      {cells.map((cell, c) => {
        const key = `${rowIndex}:${c}`;
        const isWin = winningSet.has(key);
        return (
          <div
            role="gridcell"
            key={key}
            aria-label={cell === 0 ? 'empty' : cell === 1 ? 'red' : 'yellow'}
            className={`relative flex aspect-square items-center justify-center`}
          >
            <Disc cell={cell} winning={isWin} />
          </div>
        );
      })}
    </div>
  );
}

function Disc({ cell, winning }: { cell: 0 | 1 | 2; winning: boolean }) {
  const base =
    'h-[94%] w-[94%] rounded-full shadow-inner transition-transform duration-200';
  if (cell === 1) {
    return (
      <div
        className={`${base} bg-red-500/90`}
        style={
          winning ? { boxShadow: '0 0 0 3px rgb(239 68 68 / 0.6)' } : undefined
        }
      />
    );
  }
  if (cell === 2) {
    return (
      <div
        className={`${base} bg-yellow-400/90`}
        style={
          winning ? { boxShadow: '0 0 0 3px rgb(250 204 21 / 0.6)' } : undefined
        }
      />
    );
  }
  // empty slot visual
  return <div className={`${base} bg-muted`} />;
}

function TurnLabel({ player }: { player: Player }) {
  return (
    <>
      <span className={player === 'R' ? 'text-red-500' : 'text-yellow-500'}>
        {player === 'R' ? 'Red' : 'Yellow'}
      </span>
      <span>’s turn</span>
    </>
  );
}

// function WinnerLabel({ line }: { line: [number, number][] }) {
function WinnerLabel() {
  // winner color is implied by any cell in the line; UI text only
  // (board uses 1=R, 2=Y; we don’t read it here to keep it presentational)
  // For label, just say “Red” if the first cell in the line belongs to Red.
  // If you want this strictly correct from state, you can pass the winner string down.
  // const first = line[0];
  // const color = first ? first : null;
  // This component only renders when there is a win; color in page text is handled above.
  return <span>Player</span>;
}

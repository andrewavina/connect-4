// app/game/page.tsx
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { aiBestMove, depthForDifficulty } from '@/lib/game/ai';

type Snapshot = {
  board: Board;
  current: Player;
  lastMove: { row: number; col: number } | null;
};

export default function GamePage() {
  const lastAiTurnRef = useRef<number>(-1);
  const boardShellRef = useRef<HTMLDivElement>(null);
  const confettiRef = useRef<HTMLCanvasElement>(null);
  // STATE:
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
  const [mode, setMode] = useState<'local' | 'ai'>('local');
  const [youGoFirst, setYouGoFirst] = useState(true); // in AI mode, true → you are Red
  const [difficulty, setDifficulty] = useState<1 | 2 | 3>(2);
  const [thinking, setThinking] = useState(false);
  const [pendingAiStart, setPendingAiStart] = useState(false);
  const [hoverCol, setHoverCol] = useState<number | null>(null);

  const hasStarted = lastMove !== null || history.length > 0;

  const humanPlayer: Player =
    mode === 'ai' ? (youGoFirst ? 'R' : 'Y') : current;
  const aiPlayer: Player = mode === 'ai' ? (youGoFirst ? 'Y' : 'R') : 'R'; // unused in local

  const gameEnded = !!winningLine || draw;

  const onNewGame = useCallback(() => {
    setBoard(createBoard());
    setCurrent('R');
    setWinningLine(null);
    setDraw(false);
    setLastMove(null);
    setHistory([]);
    lastAiTurnRef.current = -1;
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
    (col: number, opts?: { fromAI?: boolean }) => {
      if (gameEnded) return;
      if (mode === 'ai' && !opts?.fromAI) {
        // human can only play when it's their turn and AI isn't thinking
        if (current !== humanPlayer || thinking) return;
      }

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
    [board, current, gameEnded, lastMove, humanPlayer, thinking, mode]
  );

  // For rendering: convenient map of winning cells
  const winningSet = useMemo(() => {
    const set = new Set<string>();
    winningLine?.forEach(([r, c]) => set.add(`${r}:${c}`));
    return set;
  }, [winningLine]);

  useEffect(() => {
    if (mode !== 'ai' || gameEnded) return;
    if (current !== aiPlayer) return;
    if (thinking) return;
    // Don’t double-schedule for the same position/turn
    const thisTurn = history.length;
    if (pendingAiStart) return; // opening handled elsewhere
    if (lastAiTurnRef.current === thisTurn) return;
    lastAiTurnRef.current = thisTurn;

    const depth = depthForDifficulty(difficulty);
    setThinking(true);

    function doAi() {
      try {
        const col = aiBestMove(board, current, aiPlayer, depth);
        console.log('doAi: ', col);
        // apply via the same handler, but mark as AI so the guard lets it through
        handleColumnClick(col, { fromAI: true });
      } finally {
        setThinking(false);
      }
    }
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(doAi);
    } else {
      setTimeout(doAi, 0);
    }

    // no cleanup on purpose
    return;
  }, [
    mode,
    gameEnded,
    current,
    aiPlayer,
    thinking,
    difficulty,
    board,
    handleColumnClick,
    history,
    pendingAiStart,
  ]);

  useEffect(() => {
    // fresh game whenever mode or who-goes-first changes
    onNewGame();
    // if AI is Red (youGoFirst === false), schedule exactly one opening move
    setPendingAiStart(mode === 'ai' && !youGoFirst);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, youGoFirst]);

  useEffect(() => {
    if (!pendingAiStart) return;
    if (mode !== 'ai' || gameEnded || thinking) return;
    if (current !== aiPlayer) return; // wait until it's AI's turn on the fresh board

    setPendingAiStart(false); // consume the flag
    // mark this opening turn as scheduled so the normal effect won’t double-fire
    lastAiTurnRef.current = history.length;

    // run after paint; don't cancel to avoid races
    setTimeout(() => {
      const depth = depthForDifficulty(difficulty);
      const col = aiBestMove(board, current, aiPlayer, depth);
      handleColumnClick(col, { fromAI: true });
    }, 0);
  }, [
    pendingAiStart,
    mode,
    gameEnded,
    thinking,
    current,
    aiPlayer,
    difficulty,
    board,
    handleColumnClick,
    history,
  ]);

  useEffect(() => {
    if (!winningLine) return;
    const canvas = confettiRef.current;
    const shell = boardShellRef.current;
    if (!canvas || !shell) return;

    // size canvas to board
    const rect = shell.getBoundingClientRect();
    canvas.width = Math.floor(rect.width);
    canvas.height = Math.floor(rect.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // simple confetti particles
    const colors = ['#ef4444', '#facc15', '#60a5fa', '#34d399', '#f472b6'];
    const N = 120;
    const P = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 40,
      vx: (Math.random() - 0.5) * 2.2,
      vy: -(2 + Math.random() * 2),
      g: 0.12 + Math.random() * 0.08,
      s: 2 + Math.random() * 3,
      c: colors[(Math.random() * colors.length) | 0],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2,
    }));

    let raf = 0;
    const step = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of P) {
        p.vy += p.g;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.s, -p.s, p.s * 2, p.s * 2);
        ctx.restore();
      }
      raf = requestAnimationFrame(step);
    };
    step();

    // stop & clear after ~1.3s
    const t = setTimeout(() => {
      cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 1300);

    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [winningLine]);

  console.log("'GamePage' render: ", { winningLine });

  return (
    <section className="mx-auto max-w-3xl">
      <div className="flex items-center gap-3">
        {/* Mode toggle */}
        <div className="inline-flex rounded-full border p-0.5">
          <button
            type="button"
            onClick={() => setMode('local')}
            disabled={hasStarted}
            className={`px-3 py-1.5 text-sm rounded-full ${
              mode === 'local' ? 'bg-muted' : ''
            } disabled:opacity-50 disabled:pointer-events-none`}
          >
            Local
          </button>
          <button
            type="button"
            onClick={() => setMode('ai')}
            disabled={hasStarted}
            className={`px-3 py-1.5 text-sm rounded-full ${
              mode === 'ai' ? 'bg-muted' : ''
            } disabled:opacity-50 disabled:pointer-events-none`}
          >
            vs Computer
          </button>
        </div>

        {/* AI-only options */}
        {mode === 'ai' && (
          <>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={youGoFirst}
                onChange={(e) => setYouGoFirst(e.target.checked)}
                className="h-4 w-4"
                disabled={hasStarted}
              />
              You go first
            </label>

            <label className="inline-flex items-center gap-2 text-sm">
              Difficulty
              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(Number(e.target.value) as 1 | 2 | 3)
                }
                disabled={hasStarted}
                className="rounded-md border bg-background px-2 py-1 text-sm"
              >
                <option value={1}>Easy</option>
                <option value={2}>Medium</option>
                <option value={3}>Hard</option>
              </select>
            </label>

            {thinking && (
              <span className="text-sm text-muted-foreground">
                Computer is thinking…
              </span>
            )}
          </>
        )}
      </div>

      {/* Controls */}
      <div className="mb-6 flex items-center justify-between">
        <div
          aria-live="polite"
          className="text-sm text-muted-foreground"
          data-testid="status"
        >
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
      <div className="mx-auto w-[min(92vw,calc(100dvh-260px))]">
        <div
          ref={boardShellRef}
          className="relative rounded-xl border bg-muted p-2 shadow-inner"
        >
          {/* Visual grid of cells */}
          <div
            role="grid"
            aria-label="Connect Four board"
            className="grid aspect-[7/6] grid-rows-6 gap-0.5 rounded-lg bg-background p-1.5 sm:gap-1 sm:p-3"
          >
            {Array.from({ length: ROWS }).map((_, r) => (
              <Row
                key={r}
                rowIndex={r}
                cells={board[r]}
                winningSet={winningSet}
                board={board}
                current={current}
                gameEnded={gameEnded}
                hoverCol={hoverCol}
                mode={mode}
                youGoFirst={youGoFirst}
                lastMove={lastMove}
              />
            ))}
          </div>
          {/* Column click overlay (large hit targets) */}
          <div className="pointer-events-none absolute inset-0 grid grid-cols-7">
            {Array.from({ length: COLS }).map((_, c) => (
              <button
                key={c}
                type="button"
                data-testid={`col-${c}`}
                aria-label={`Drop in column ${c + 1}`}
                onClick={() => handleColumnClick(c)}
                onMouseEnter={() => setHoverCol(c)}
                onMouseLeave={() => setHoverCol(null)}
                onFocus={() => setHoverCol(c)}
                onBlur={() => setHoverCol(null)}
                className="pointer-events-auto h-full w-full rounded-md focus:outline-none hover:bg-foreground/10 hover:backdrop-brightness-110 focus:bg-foreground/15 focus:backdrop-brightness-125"
              />
            ))}
          </div>
          {/* Confetti canvas */}
          <canvas
            ref={confettiRef}
            className="pointer-events-none absolute inset-0"
          />
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
  board,
  current,
  gameEnded,
  hoverCol,
  mode,
  youGoFirst,
  lastMove,
}: {
  rowIndex: number;
  cells: Board[number];
  winningSet: Set<string>;
  board: Board;
  current: Player;
  gameEnded: boolean;
  hoverCol: number | null;
  mode: 'local' | 'ai';
  youGoFirst: boolean;
  lastMove: { row: number; col: number } | null;
}) {
  function landingRow(board: Board, col: number) {
    for (let r = ROWS - 1; r >= 0; r--) if (board[r][col] === 0) return r;
    return -1;
  }
  const ghostRow = hoverCol != null ? landingRow(board, hoverCol) : -1;

  return (
    <div role="row" className="grid grid-cols-7 gap-1">
      {cells.map((cell, c) => {
        const key = `${rowIndex}:${c}`;
        const isWin = winningSet.has(key);
        const showGhost =
          !gameEnded &&
          hoverCol != null &&
          c === hoverCol &&
          rowIndex === ghostRow &&
          board[rowIndex][c] === 0 &&
          (mode === 'local' ? true : current === (youGoFirst ? 'R' : 'Y')); // human’s turn in AI mode
        const isLast =
          lastMove && lastMove.row === rowIndex && lastMove.col === c;

        return (
          <div
            role="gridcell"
            key={key}
            aria-label={cell === 0 ? 'empty' : cell === 1 ? 'red' : 'yellow'}
            className={`relative flex aspect-square items-center justify-center`}
          >
            <Disc
              cell={cell}
              winning={isWin}
              showGhost={showGhost}
              current={current}
              isLast={!!isLast}
            />
          </div>
        );
      })}
    </div>
  );
}

const Disc = ({
  cell,
  winning,
  showGhost,
  current,
  isLast,
}: {
  cell: 0 | 1 | 2;
  winning: boolean;
  showGhost: boolean;
  current: Player;
  isLast: boolean;
}) => {
  const base =
    'h-[92%] w-[92%] rounded-full shadow-inner transition-transform duration-200';
  const anim = isLast ? 'animate-chip-drop' : '';

  if (cell === 1) {
    // RED
    return (
      <div
        className={`${base} bg-red-500/90 ring-1 ring-foreground/10 ${anim} ${
          winning ? 'animate-win win-glow-red' : ''
        }`}
      />
    );
  }
  if (cell === 2) {
    // YELLOW
    return (
      <div
        className={`${base} bg-yellow-400/90 ring-1 ring-foreground/10 ${anim} ${
          winning ? 'animate-win win-glow-yellow' : ''
        }`}
      />
    );
  }
  // empty slot + (optional) ghost overlay
  return (
    <>
      <div
        className={`${base} ring-1 ring-foreground/10`}
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.08), rgba(0,0,0,0.06) 60%, transparent 70%)',
        }}
      />
      {showGhost && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="h-[92%] w-[92%] rounded-full ring-1 ring-foreground/15"
            style={{
              background:
                current === 'R'
                  ? 'rgba(239,68,68,0.35)'
                  : 'rgba(250,204,21,0.40)',
            }}
          />
        </div>
      )}
    </>
  );
};

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

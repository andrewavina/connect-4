/** Board constants */
export const COLS = 7 as const;
export const ROWS = 6 as const;

/** Players & cells */
export type Player = "R" | "Y";
export type Cell = 0 | 1 | 2; // 0=empty, 1=R, 2=Y
export type Board = Cell[][]; // [row][col], rows=6, cols=7

/** Utility: swap player */
export function nextPlayer(p: Player): Player {
  return p === "R" ? "Y" : "R";
}

/** Create an empty 6x7 board */
export function createBoard(): Board {
  return Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(0));
}

/** Deep clone (small board; simple & safe) */
export function cloneBoard(board: Board): Board {
  return board.map((row) => row.slice());
}

/** Convert between player <-> cell value */
export function playerToCell(p: Player): Cell {
  return p === "R" ? 1 : 2;
}
export function cellToPlayer(c: Cell): Player | null {
  return c === 1 ? "R" : c === 2 ? "Y" : null;
}

/** Bounds check */
export function inBounds(row: number, col: number): boolean {
  return row >= 0 && row < ROWS && col >= 0 && col < COLS;
}

/** Is a column full? */
export function isColumnFull(board: Board, col: number): boolean {
  if (col < 0 || col >= COLS) return true;
  return board[0][col] !== 0; // top cell occupied -> full
}

/** Columns that can accept a move */
export function getLegalMoves(board: Board): number[] {
  const cols: number[] = [];
  for (let c = 0; c < COLS; c++) {
    if (!isColumnFull(board, c)) cols.push(c);
  }
  return cols;
}

/**
 * Drop a disc into a column (immutable).
 * Returns the new board and the resting (row,col) of the disc.
 * Throws if the column is full or col is out of range.
 */
export function applyMove(
  board: Board,
  col: number,
  player: Player
): { board: Board; row: number; col: number } {
  if (col < 0 || col >= COLS) throw new Error("Invalid column.");
  if (isColumnFull(board, col)) throw new Error("Column is full.");

  const b = cloneBoard(board);
  const disc = playerToCell(player);

  // find lowest empty row in this column
  let placeRow = -1;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (b[r][col] === 0) {
      placeRow = r;
      break;
    }
  }
  if (placeRow === -1) throw new Error("Column is full."); // safeguard

  b[placeRow][col] = disc;
  return { board: b, row: placeRow, col };
}

/**
 * Check for a win from the LAST move only.
 * Returns winner and the exact 4-cell winning line (row,col) if present.
 */
export function checkWin(
  board: Board,
  lastRow: number,
  lastCol: number
): { winner: Player; line: [number, number][] } | null {
  const disc = board[lastRow]?.[lastCol];
  if (disc === 0 || disc === undefined) return null;

  const dirs: Array<[number, number]> = [
    [0, 1],  // horizontal →
    [1, 0],  // vertical ↓
    [1, 1],  // diag ↘
    [1, -1], // diag ↙
  ];

  for (const [dr, dc] of dirs) {
    const line = collectLine(board, lastRow, lastCol, dr, dc);
    if (line.length >= 4) {
      // Return the four cells that include the last move and are contiguous
      const four = pickFourIncluding(line, [lastRow, lastCol]);
      const winner = cellToPlayer(disc)!;
      return { winner, line: four };
    }
  }
  return null;
}

/** Draw = board is full AND no win */
export function isDraw(board: Board): boolean {
  for (let c = 0; c < COLS; c++) {
    if (!isColumnFull(board, c)) return false;
  }
  return true;
}

/** ---------- Helpers ---------- */

/**
 * Collect a full line of same-colored discs passing through (r,c)
 * along direction (dr,dc), scanning both backward and forward.
 */
function collectLine(
  board: Board,
  r: number,
  c: number,
  dr: number,
  dc: number
): [number, number][] {
  const target = board[r][c];
  const cells: [number, number][] = [];

  // scan backward (negative direction)
  let rr = r;
  let cc = c;
  while (inBounds(rr, cc) && board[rr][cc] === target) {
    rr -= dr;
    cc -= dc;
  }
  // step forward once to the first matching cell
  rr += dr;
  cc += dc;

  // go forward collecting
  while (inBounds(rr, cc) && board[rr][cc] === target) {
    cells.push([rr, cc]);
    rr += dr;
    cc += dc;
  }
  return cells;
}

/**
 * From a collected line (length >= 4), return exactly four contiguous cells
 * that include the pivot (the last move). This keeps UI highlighting simple.
 */
function pickFourIncluding(
  line: [number, number][],
  pivot: [number, number]
): [number, number][] {
  const idx = line.findIndex(([r, c]) => r === pivot[0] && c === pivot[1]);
  // start window so pivot is inside; clamp within bounds
  const start = Math.max(0, Math.min(idx - 3, line.length - 4));
  return line.slice(start, start + 4) as [number, number][];
}

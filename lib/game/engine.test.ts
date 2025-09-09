import { describe, it, expect } from 'vitest';
import {
  createBoard,
  applyMove,
  checkWin,
  nextPlayer,
  ROWS,
  COLS,
  type Player,
} from './engine';

function dropMany(cols: number[], start: Player = 'R') {
  let board = createBoard();
  let current: Player = start;
  let last = { row: -1, col: -1 };
  for (const c of cols) {
    const r = applyMove(board, c, current);
    board = r.board;
    last = { row: r.row, col: r.col };
    current = nextPlayer(current);
  }
  return { board, last };
}

describe('engine', () => {
  it('creates an empty board', () => {
    const b = createBoard();
    expect(b.length).toBe(ROWS);
    expect(b.every((row) => row.length === COLS)).toBe(true);
    expect(b.flat().every((v) => v === 0)).toBe(true);
  });

  it('drops into the lowest empty row', () => {
    const b0 = createBoard();
    const { board: b1, row: r1, col: c1 } = applyMove(b0, 0, 'R');
    expect(r1).toBe(ROWS - 1);
    expect(c1).toBe(0);
    const { board: b2, row: r2 } = applyMove(b1, 0, 'Y');
    expect(r2).toBe(ROWS - 2);
    // column unchanged elsewhere
    expect(b2[ROWS - 1][0]).toBe(1); // 1 = red
    expect(b2[ROWS - 2][0]).toBe(2); // 2 = yellow
  });

  it('prevents playing in a full column', () => {
    // fill column 3
    let board = createBoard();
    for (let i = 0; i < ROWS; i++) {
      board = applyMove(board, 3, i % 2 === 0 ? 'R' : 'Y').board;
    }
    // next drop in col 3 should throw
    expect(() => applyMove(board, 3, 'R')).toThrow();
  });

  it('detects a horizontal win', () => {
    const { board, last } = dropMany([0, 0, 1, 1, 2, 2, 3]); // Red wins on col 3
    const win = checkWin(board, last.row, last.col);
    expect(win?.winner).toBe('R');
    expect(win?.line.length).toBe(4);
  });

  it('detects a vertical win', () => {
    const { board, last } = dropMany([0, 1, 0, 1, 0, 1, 0]); // Red vertical on col 0
    const win = checkWin(board, last.row, last.col);
    expect(win?.winner).toBe('R');
  });

  it('detects a diagonal win (↘)', () => {
    // Staircase that makes Red win diagonally down-right at the end
    const seq = [0, 1, 1, 2, 2, 3, 2, 3, 3, 4, 3]; // last red in col 3 completes diag
    const { board, last } = dropMany(seq);
    const win = checkWin(board, last.row, last.col);
    expect(win?.winner).toBe('R');
  });
});

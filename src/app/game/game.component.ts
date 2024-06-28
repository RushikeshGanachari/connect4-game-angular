import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { ConnectFourBoardComponent } from '../connect-four-board/connect-four-board.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [ConnectFourBoardComponent, CommonModule,MatButtonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {

  gameBoard: (string | null)[][] = Array.from({ length: 6 }, () => Array(7).fill(null));
  currentPlayer: string = 'red';
  winner: string | null = null;
  moveHistory: { row: number; column: number; player: string }[] = [];
  redoStack: { row: number; column: number; player: string }[] = [];

  handleCellClick(column: number) {
    if (this.winner) return;

    for (let row = this.gameBoard.length - 1; row >= 0; row--) {
      if (!this.gameBoard[row][column]) {
        this.gameBoard[row][column] = this.currentPlayer;
        this.moveHistory.push({ row, column, player: this.currentPlayer });
        this.redoStack = [];
        if (this.checkWinner(row, column, this.currentPlayer)) {
          this.winner = this.currentPlayer;
        }
        this.currentPlayer = this.currentPlayer === 'red' ? 'yellow' : 'red';
        break;
      }
    }
  }

  undo() {
    const lastMove = this.moveHistory.pop();
    if (lastMove) {
      this.gameBoard[lastMove.row][lastMove.column] = null;
      this.redoStack.push(lastMove);
      this.currentPlayer = lastMove.player;
      this.winner = null;
    }
  }

  redo() {
    const move = this.redoStack.pop();
    if (move) {
      this.gameBoard[move.row][move.column] = move.player;
      this.moveHistory.push(move);
      this.currentPlayer = move.player === 'red' ? 'yellow' : 'red';
      if (this.checkWinner(move.row, move.column, move.player)) {
        this.winner = move.player;
      }
    }
  }

  checkWinner(row: number, column: number, player: string): boolean {
    return this.checkDirection(row, column, player, 1, 0) ||
           this.checkDirection(row, column, player, 0, 1) ||
           this.checkDirection(row, column, player, 1, 1) ||
           this.checkDirection(row, column, player, 1, -1);
  }

  checkDirection(row: number, column: number, player: string, rowDir: number, colDir: number): boolean {
    let count = 0;
    for (let i = -3; i <= 3; i++) {
      const r = row + i * rowDir;
      const c = column + i * colDir;
      if (r >= 0 && r < this.gameBoard.length && c >= 0 && c < this.gameBoard[0].length && this.gameBoard[r][c] === player) {
        count++;
        if (count === 4) {
          return true;
        }
      } else {
        count = 0;
      }
    }
    return false;
  }
}

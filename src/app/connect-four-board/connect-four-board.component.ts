import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-connect-four-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './connect-four-board.component.html',
  styleUrl: './connect-four-board.component.css'
})
export class ConnectFourBoardComponent {

  @Input() board: (string | null)[][] = [];
  @Output() cellClick = new EventEmitter<number>();

  onCellClick(column: number): void {
    this.cellClick.emit(column);
  }
}

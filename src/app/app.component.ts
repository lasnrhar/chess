import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Increase } from './increase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('chessboard') chessboard!: ElementRef;
  game: Increase;
  loading = true;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.game = new Increase(this.chessboard);
    this.game.init();
    this.loading = false;
    this.cdRef.detectChanges();
  }
}

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Increase, Upgrade } from './increase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('chessboard') chessboard!: ElementRef;
  game: Increase;
  loading = true;
  debug = true;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.game = new Increase(this.chessboard);
    this.game.init();
    this.loading = false;
    this.cdRef.detectChanges();
  }

  valToDisplayVal(val): string {
    const units = ['k', 'M', 'G', 'T', 'P'];
    let i = 0;
    while (val >= 1000 && i < units.length) {
      val /= 1000;
      i++;
    }
    if (i === 0) {
      return val.toString();
    } else {
      return val.toFixed(2) + units[i - 1];
    }
  }

  getUpgradeValue(key): number {
    return Upgrade.getUpgradeValue(key, this.game.data.findUpgradeByKey(key));
  }
}

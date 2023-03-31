import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-wealth',
  templateUrl: './wealth.component.html',
  styleUrls: ['./wealth.component.scss'],
})
export class WealthComponent {
  @Input() wealth = 0;
  @Input() earn = 0;
  wealthDisplay = 0;
  lastValue = 0;

  ngOnChanges() {
    let idx = 1;
    let difference = this.wealth - this.lastValue;
    let interval = setInterval(() => {
      if (idx != 10) {
        idx++;
        this.wealthDisplay = this.lastValue + idx * (difference / 10);
      } else {
        clearInterval(interval);
        this.lastValue = this.wealth;
      }
    }, 2);
  }

  valToDisplayVal(val): string {
    const units = ['k', 'M', 'G', 'T', 'P'];
    let i = 0;
    while (val >= 1000 && i < units.length) {
      val /= 1000;
      i++;
    }
    if (i === 0) {
      return val.toFixed(0);
    } else {
      return val.toFixed(2) + units[i - 1];
    }
  }
}

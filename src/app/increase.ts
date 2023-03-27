import { ElementRef } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { Gomoku } from './chess';

export class Increase {
  gomoku: Gomoku;
  data: GameData = new GameData();
  subscribe: Subscription = new Subscription();

  constructor(element: ElementRef<HTMLCanvasElement>) {
    this.gomoku = new Gomoku(element, this);
  }

  init() {
    this.gomoku.init();
    this.initUpgrades();
  }

  initUpgrades() {
    this.data.upgrades.push({ key: 'autoplay', value: new Upgrade(0, 10, 5) });
  }

  win(): boolean {
    if (!this.gomoku.over) {
      return false;
    }
    if (this.gomoku.winner == -1) {
      this.gomoku.reset();
      return false;
    } else if (this.gomoku.winner == 1) {
      this.data.point += 1;
      this.data.totalPoint += 1;
      this.gomoku.reset();
      return true;
    }
    return false;
  }

  resetGomoku() {
    this.gomoku.reset();
  }

  update(item: string) {
    if (this.data.point >= this.data.findUpgradeByKey(item).cost) {
      this.data.findUpgradeByKey(item).level += 1;
      this.data.point -= this.data.findUpgradeByKey(item).cost;
    }

    this.startAuto();
  }

  cheat() {
    this.data.point += 1000;
    this.data.totalPoint += 1000;
  }

  startAuto() {
    this.subscribe.unsubscribe();

    let time = 1000 / (this.data.findUpgradeByKey('autoplay').level + 1);
    this.subscribe = interval(time).subscribe((v: any) => {
      this.gomoku.autoPlay();
    });
  }
}

class GameData {
  totalPoint = 0;
  point = 0;
  upgrades: { key: string; value: Upgrade }[] = [];

  findUpgradeByKey(key: string): Upgrade {
    return this.upgrades.find((item) => item.key == key).value;
  }
}

class Upgrade {
  level = 0;
  max = 10;
  cost = 5;
  constructor(level: number, max: number, cost: number) {
    this.level = level;
    this.max = max;
    this.cost = cost;
  }
}

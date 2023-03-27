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
    this.initGame();
    this.load();
    this.startAuto();
  }

  initGame() {
    this.data = new GameData();
    this.data.upgrades.push({
      key: 'autoplay',
      value: new Upgrade('Auto play', 0, 10, 5),
    });
    this.data.upgrades.push({
      key: 'wincount',
      value: new Upgrade('The number of pieces required to win', 0, 3, 1000),
    });
    this.data.upgrades.push({
      key: 'pointgain',
      value: new Upgrade('The score obtained from winning', 0, 100, 10),
    });
  }

  win(): boolean {
    if (!this.gomoku.over) {
      return false;
    }
    if (this.gomoku.winner == -1) {
      this.gomoku.reset();
      return false;
    } else if (this.gomoku.winner == 1) {
      let pointUpgrade = this.data.findUpgradeByKey('pointgain');
      let point = Upgrade.getUpgradeValue('pointgain', pointUpgrade);
      this.data.point += point;
      this.data.totalPoint += point;
      this.gomoku.reset();
      return true;
    }
    return false;
  }

  resetGomoku() {
    this.gomoku.reset();
  }

  upgrade(key: string) {
    if (!this.usable(key)) {
      return;
    }
    let upgrade = this.data.findUpgradeByKey(key);
    upgrade.level += 1;
    this.data.point -= upgrade.cost;

    upgrade.cost = Upgrade.getUpgradeCost(key, upgrade);

    this.startAuto();
  }

  cheat() {
    this.data.point += 1000 * 1000 * 1000 * 1000;
    this.data.totalPoint += 1000 * 1000 * 1000 * 1000;
  }

  clear() {
    this.initGame();
    this.save();
    this.stopAuto();
    this.resetGomoku();
  }

  usable(key): boolean {
    let upgrade = this.data.findUpgradeByKey(key);
    if (this.data.point < upgrade.cost) {
      return false;
    }
    if (upgrade.level >= upgrade.max) {
      return false;
    }
    return true;
  }

  startAuto() {
    this.subscribe.unsubscribe();
    let upgrade = this.data.findUpgradeByKey('autoplay');
    if (upgrade.level > 0) {
      let time = Upgrade.getUpgradeValue('autoplay', upgrade);
      this.subscribe = interval(time).subscribe((v: any) => {
        this.gomoku.autoPlay();
        this.save();
      });
    }
  }

  stopAuto() {
    this.subscribe.unsubscribe();
  }

  save() {
    let str = JSON.stringify(this.data);
    localStorage.setItem('game', btoa(unescape(encodeURIComponent(str))));
  }

  load() {
    let str = localStorage.getItem('game');
    if (str) {
      let save = JSON.parse(decodeURIComponent(escape(atob(str))));
      this.data.totalPoint = save.totalPoint;
      this.data.point = save.point;
      this.data.upgrades = save.upgrades;
    }
  }
}

class GameData {
  totalPoint = 0;
  point = 0;
  upgrades: { key: string; value: Upgrade }[] = [];

  findUpgradeByKey(key: string): Upgrade {
    let upgrade = this.upgrades.find((item) => item.key == key);
    if (upgrade) {
      return upgrade.value;
    }
    return new Upgrade('', 0, 0, 0);
  }
}

export class Upgrade {
  level = 0;
  max = 10;
  cost = 5;
  title = '';
  constructor(title: string, level: number, max: number, cost: number) {
    this.title = title;
    this.level = level;
    this.max = max;
    this.cost = cost;
  }

  static getUpgradeCost(key: string, upgrade: Upgrade): number {
    switch (key) {
      case 'autoplay':
        return upgrade.cost * 10 * upgrade.level;
      case 'wincount':
        return upgrade.cost * 10 * upgrade.level;
      case 'pointgain':
        return upgrade.cost * 10;
    }
    return 5;
  }

  static getUpgradeValue(key: string, upgrade: Upgrade): number {
    switch (key) {
      case 'autoplay':
        return 1000 / upgrade.level;
      case 'wincount':
        return upgrade.level > 3 ? 2 : 5 - upgrade.level;
      case 'pointgain':
        return upgrade.level == 0 ? 1 : upgrade.level * 10;
    }
    return 0;
  }
}

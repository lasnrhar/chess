import { ElementRef } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { Building } from './building';
import { Gomoku } from './chess';
import { GameData } from './game-data';
import { Upgrade } from './upgrade';

export class Increase {
  gomoku: Gomoku;
  data: GameData = new GameData();
  auto: Subscription = new Subscription();
  statistics: Subscription = new Subscription();
  earnPerSecond = 0;
  earnInStatistics = 0;

  constructor(element: ElementRef<HTMLCanvasElement>) {
    this.gomoku = new Gomoku(element, this);
  }

  init() {
    this.gomoku.init();
    this.initGame();
    this.load();
    this.startAuto();
    this.startStatistics();
  }

  initGame() {
    this.data = new GameData();
    this.data.upgrades = Upgrade.init();
    this.data.buildings = Building.init();
  }

  win(): boolean {
    if (!this.gomoku.over) {
      return false;
    }
    if (this.gomoku.winner == -1) {
      this.gomoku.reset();
      return false;
    } else if (this.gomoku.winner == 1) {
      let wealth = this.data.earnPerWin();
      this.earnInStatistics += wealth;
      this.data.wealth += wealth;
      this.data.totalWealth += wealth;
      this.gomoku.reset();
      return true;
    }
    return false;
  }

  resetGomoku() {
    this.gomoku.reset();
  }

  buildOnce(key: string) {
    if (!this.usable('building', key)) {
      return false;
    }
    let building = this.data.findBuildingByKey(key);
    this.data.wealth -= building.cost;
    building.count += 1;
    building.historyCount += 1;

    building.cost = Building.getBuildCost(key, building);

    if (building.consume.key != '') {
      let consume = this.data.findBuildingByKey(building.consume.key);
      consume.count -= building.consume.value * 1;
    }
    return true;
  }

  build(key: string) {
    this.buildOnce(key);
    this.startAuto();
  }

  maxBuild(key: string) {
    let res = true;
    while (res) {
      res = this.buildOnce(key);
    }
    this.startAuto();
  }

  upgrade(key: string) {
    if (!this.usable('upgrade', key)) {
      return;
    }
    let upgrade = this.data.findUpgradeByKey(key);
    this.data.wealth -= upgrade.cost;
    upgrade.level += 1;

    upgrade.cost = Upgrade.getUpgradeCost(key, upgrade);

    this.startAuto();
  }

  usable(type, key): boolean {
    if (type == 'upgrade') {
      let upgrade = this.data.findUpgradeByKey(key);
      if (this.data.wealth < upgrade.cost) {
        return false;
      }
      if (upgrade.level >= upgrade.max) {
        return false;
      }
    }
    if (type == 'building') {
      let building = this.data.findBuildingByKey(key);
      if (this.data.wealth < building.cost) {
        return false;
      }
      if (building.consume.key != '') {
        let consume = this.data.findBuildingByKey(building.consume.key);
        if (consume.count < building.consume.value) {
          return false;
        }
      }
    }
    return true;
  }

  startAuto() {
    this.auto.unsubscribe();
    let upgrade = this.data.findUpgradeByKey('autoplay');
    if (this.data.earnPerWin() > 1 || upgrade.level > 0) {
      let time = Upgrade.getUpgradeValue('autoplay', upgrade);
      this.auto = interval(time).subscribe((v: any) => {
        this.gomoku.autoPlay();
        this.save();
      });
    }
  }

  stopAuto() {
    if (this.auto != null) {
      this.auto.unsubscribe();
    }
  }

  startStatistics() {
    this.statistics.unsubscribe();
    this.statistics = interval(1000).subscribe(() => {
      this.earnPerSecond = this.earnInStatistics;
      this.earnInStatistics = 0;
    });
  }

  save() {
    let str = JSON.stringify(this.data);
    localStorage.setItem('game', btoa(unescape(encodeURIComponent(str))));
  }

  load() {
    let str = localStorage.getItem('game');
    if (str) {
      let save = JSON.parse(decodeURIComponent(escape(atob(str))));
      this.data.totalWealth = save.totalWealth;
      this.data.wealth = save.wealth;
      this.data.loop = save.loop;
      this.data.upgrades = save.upgrades;
      this.data.buildings = save.buildings;
    }
  }

  cheat() {
    this.data.wealth += 1000 * 1000 * 1000;
    this.data.totalWealth += 1000 * 1000 * 1000;
  }

  clear() {
    this.initGame();
    this.save();
    this.stopAuto();
    this.resetGomoku();
  }
}

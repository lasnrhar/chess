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

  static init(): { key: string; value: Upgrade }[] {
    let upgrades = [];
    upgrades.push({
      key: 'autoplay',
      value: new Upgrade('Auto play speed', 0, 50, 100),
    });
    upgrades.push({
      key: 'wincount',
      value: new Upgrade('The number of pieces required to win', 0, 3, 10000),
    });

    return upgrades;
  }

  static getUpgradeCost(key: string, upgrade: Upgrade): number {
    switch (key) {
      case 'autoplay':
        return Math.pow(upgrade.level, 3) * 3 + 100;
      case 'wincount':
        return Math.pow(1000, upgrade.level + 1);
    }
    return 5;
  }

  static getUpgradeValue(key: string, upgrade: Upgrade): number {
    switch (key) {
      case 'autoplay':
        return upgrade.level == 0 ? 1000 : 1000 / upgrade.level;
      case 'wincount':
        return upgrade.level > 3 ? 2 : 5 - upgrade.level;
    }
    return 0;
  }
}

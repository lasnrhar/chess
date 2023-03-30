export class Upgrade {
  level = 0;
  max = 10;
  cost = 5;
  description = '';
  title = '';
  constructor(
    title: string,
    description: string,
    level: number,
    max: number,
    cost: number
  ) {
    this.title = title;
    this.description = description;
    this.level = level;
    this.max = max;
    this.cost = cost;
  }

  static init(): { key: string; value: Upgrade }[] {
    let upgrades = [];
    upgrades.push({
      key: 'autoplay',
      value: new Upgrade(
        'Auto play speed',
        'Increase the speed at which your employees are working.',
        0,
        50,
        1000
      ),
    });
    upgrades.push({
      key: 'wincount',
      value: new Upgrade(
        'The number of pieces required to win',
        'Amend the law to reduce the number of connected pieces required to win Gomoku.',
        0,
        3,
        1000 * 1000
      ),
    });

    return upgrades;
  }

  static getUpgradeCost(key: string, upgrade: Upgrade): number {
    switch (key) {
      case 'autoplay':
        return 1000 * Math.pow(upgrade.level, 3) * 3 ;
      case 'wincount':
        return 1000 * 1000 * Math.pow(10, upgrade.level + 1);
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

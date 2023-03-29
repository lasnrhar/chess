export class Building {
  count = 0;
  historyCount = 0;
  cost = 0;
  earn = 0;
  consume: { key: string; value: number } = { key: '', value: 0 };
  title = '';
  description = '';
  constructor(
    title: string,
    description: string,
    count: number,
    earn: number,
    cost: number,
    consume: { key: string; value: number } = { key: '', value: 0 }
  ) {
    this.title = title;
    this.description = description;
    this.earn = earn;
    this.count = count;
    this.cost = cost;
    this.consume = consume;
  }

  static init(): { key: string; value: Building }[] {
    let buildings = [];

    buildings.push({
      key: 'player',
      value: new Building(
        'chess player',
        'hire a chess player to play chess for you',
        0,
        5,
        5
      ),
    });

    buildings.push({
      key: 'group',
      value: new Building(
        'player group',
        'make your chess player a group, work more efficiently',
        0,
        50,
        100,
        {
          key: 'player',
          value: 5,
        }
      ),
    });

    buildings.push({
      key: 'company',
      value: new Building(
        'chess company',
        'combining your organization into a company makes it more efficient',
        0,
        500,
        1000,
        {
          key: 'group',
          value: 5,
        }
      ),
    });
    return buildings;
  }

  static getBuildCost(key: string, building: Building): number {
    switch (key) {
      case 'player':
        return building.cost + building.cost * 0.01;
      default:
        return building.cost * 1.3;
    }
  }
}

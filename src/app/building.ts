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
        'Hire a chess player to play chess for you',
        0,
        5,
        5
      ),
    });

    buildings.push({
      key: 'group',
      value: new Building(
        'player group',
        'Make your chess player a group, work more efficiently',
        0,
        50,
        100,
        {
          key: 'player',
          value: 10,
        }
      ),
    });

    buildings.push({
      key: 'company',
      value: new Building(
        'chess company',
        'Combining your group into a company makes it more efficient',
        0,
        500,
        1000,
        {
          key: 'group',
          value: 5,
        }
      ),
    });

    buildings.push({
      key: 'companyBigger',
      value: new Building(
        'bigger company',
        "Optimizing the company's structure has increased efficiency.",
        0,
        5000,
        10000,
        {
          key: 'company',
          value: 3,
        }
      ),
    });

    buildings.push({
      key: 'companyListed',
      value: new Building(
        'listed company',
        'Integrating the company and going public, bring more player to play chess for you.',
        0,
        50000,
        100000,
        {
          key: 'companyBigger',
          value: 3,
        }
      ),
    });

    buildings.push({
      key: 'country',
      value: new Building(
        'small country',
        'Try to purchase a small country, have all the people in the country play chess for you.',
        0,
        50000,
        100000,
        {
          key: 'companyListed',
          value: 3,
        }
      ),
    });

    buildings.push({
      key: 'countryBigger',
      value: new Building(
        'country',
        'After annexing the surrounding countries, you have become a regional power.',
        0,
        500000,
        1000000,
        {
          key: 'country',
          value: 3,
        }
      ),
    });

    buildings.push({
      key: 'continent',
      value: new Building(
        'continent',
        'Unifying a continent.',
        0,
        5000000,
        10000000,
        {
          key: 'countryBigger',
          value: 3,
        }
      ),
    });

    buildings.push({
      key: 'earth',
      value: new Building(
        'Earth',
        'Now, people all over the world are playing chess for you.',
        0,
        5000000,
        10000000,
        {
          key: 'continent',
          value: 7,
        }
      ),
    });
    return buildings;
  }

  static getBuildCost(key: string, building: Building): number {
    switch (key) {
      case 'player':
        return building.cost + Math.min(building.cost * 0.01, 100);
      case 'group':
        return building.cost + Math.min(building.cost * 0.01, 500);
      case 'company':
        return building.cost + Math.min(building.cost * 0.01, 1000);
      case 'companyBigger':
        return building.cost + Math.min(building.cost * 0.01, 5000);
      case 'companyListed':
        return building.cost + Math.min(building.cost * 0.01, 10000);
      case 'country':
        return building.cost + Math.min(building.cost * 0.01, 50000);
      case 'countryBigger':
        return building.cost + Math.min(building.cost * 0.01, 100000);
      case 'continent':
        return building.cost + Math.min(building.cost * 0.01, 500000);
      default:
        return building.cost * 1.3;
    }
  }
}

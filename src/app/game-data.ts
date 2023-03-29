import { Building } from "./building";
import { Upgrade } from "./upgrade";

export class GameData {
  totalWealth = 0;
  wealth = 0;
  loop = 0;
  buildings: { key: string; value: Building }[] = [];
  upgrades: { key: string; value: Upgrade }[] = [];

  findUpgradeByKey(key: string): Upgrade {
    let upgrade = this.upgrades.find((item) => item.key == key);
    if (upgrade) {
      return upgrade.value;
    }
    return new Upgrade('', 0, 0, 0);
  }

  findBuildingByKey(key: string): Building {
    let building = this.buildings.find((item) => item.key == key);
    if (building) {
      return building.value;
    }
    return new Building('', '', 0, 0, 0);
  }
}

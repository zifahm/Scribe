import * as DataLoader from "dataloader";
import { getRepository } from "typeorm";
import { User } from "../entity/User";

export const userLoader = () =>
  new DataLoader(async (keys: string[]) => {
    const users = await getRepository(User).findByIds(keys);

    console.log(users, "from data loader");
    const userMap: { [key: string]: User } = {};

    users.forEach(u => {
      userMap[u.id] = u;
    });

    console.log(userMap, "from data loader");
    // O(n) * O(1)
    return keys.map(k => userMap[k]);
  });

import * as bcrypt from "bcrypt";
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent
} from "typeorm";
import { User } from "../entity/User";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  /**
   * Called before post insertion.
   */

  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    if (event.entity.password) {
      event.entity.password = await bcrypt.hash(event.entity.password, 12);
    }
  }
}

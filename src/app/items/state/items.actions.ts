import {Item} from '../shared/models/item.model';


export class ListenForItems {
  static readonly type = '[item] Listen for items';
}

export class StopListeningForItems {
  static readonly type = '[item] Stop listening for items';
}

export class AddItem {
  constructor(public item: Item) {}

  static readonly type = '[item] add item';

}

export class UpdateItem {
  constructor(public item: Item) {}

  static readonly type = '[item] Update item';

}

export class DeleteItem {
  constructor(public item: Item) {}

  static readonly type = '[item] delete item';

}

export class UpdateItemsStore {
  constructor(public items: Item[]) {}

  static readonly type = '[item] Update items';

}

export class ItemsInCollection {
  constructor(public items: Item[]) {}

    static readonly type = '[item] items in collection';

}



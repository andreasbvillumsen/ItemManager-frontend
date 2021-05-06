import {ItemModel} from '../shared/models/ItemModel';


export class ListenForItems {
  static readonly type = '[item] Listen for items';
}

export class StopListeningForItems {
  static readonly type = '[item] Stop listening for items';
}

export class AddItem {
  constructor(public item: ItemModel) {}

  static readonly type = '[item] add item';

}

export class UpdateItem {
  constructor(public item: ItemModel) {}

  static readonly type = '[item] Update item';

}

export class DeleteItem {
  constructor(public itemId: number) {}

  static readonly type = '[item] delete item';

}

export class UpdateItemsStore {
  constructor(public items: ItemModel[]) {}

  static readonly type = '[item] Update items';

}

export class ItemsInCollection {
  constructor(public collectionId: number) {}

    static readonly type = '[item] get items in collection';

}



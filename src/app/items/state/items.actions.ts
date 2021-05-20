import {ItemModel} from '../shared/models/ItemModel';
import {CreateItemDto} from '../shared/dtos/create-item.dto';
import {UpdateItemDto} from '../shared/dtos/update-item.dto';


export class ListenForItems {
  static readonly type = '[item] Listen for items';
}

export class StopListening {
  static readonly type = '[item] Stop listening';
}

export class ListenForItemsInCollection {
  static readonly type = '[item] Listen for items in Collection';
}


export class AddItem {
  constructor(public item: CreateItemDto) {}

  static readonly type = '[item] add item';

}

export class UpdateItem {
  constructor(public item: ItemModel) {}

  static readonly type = '[item] Update item';

}

export class GetAllItems{
  static readonly type = '[item] get all Items';
}

export class DeleteItem {
  constructor(public item: UpdateItemDto) {}

  static readonly type = '[item] delete item';

}

export class UpdateItemsStore {
  constructor(public items: ItemModel[]) {}

  static readonly type = '[item] Update items';

}

export class ClearError{
  static readonly type = '[collection] clear error';
}

export class ItemsInCollection {
  constructor(public collectionId: number) {}

    static readonly type = '[item] get items in collection';

}

export class ListenForErrors {

  static readonly type = '[item] Listen for errors';

}

export class UpdateError {
  constructor(public errorMessage: string) {}

  static readonly type = '[item] Update errorMessage';

}



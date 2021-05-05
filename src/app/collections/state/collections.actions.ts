import {Collection} from '../shared/models/collection';


export class ListenForCollections {
  static readonly type = '[collection] Listen for collections';
}

export class StopListeningForCollections {
  static readonly type = '[collection] Stop listening for collections';
}

export class AddCollection {
  constructor(public collection: Collection) {}

  static readonly type = '[collection] add collection';

}

export class UpdateCollection {
  constructor(public collection: Collection) {}

  static readonly type = '[collection] Update collection';

}

export class DeleteCollection {
  constructor(public collection: Collection) {}

  static readonly type = '[collection] delete collection';

}

export class UpdateCollectionsStore {
  constructor(public collections: Collection[]) {}

  static readonly type = '[collection] Update collections';

}

export class GetCollectionsForUser{
  constructor(public Userid: number){}

  static readonly type = '[collection] get collections for user';
}




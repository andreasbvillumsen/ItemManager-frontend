import {CollectionModel} from '../shared/models/CollectionModel';


export class ListenForCollections {
  static readonly type = '[collection] Listen for collections';
}

export class StopListening {
  static readonly type = '[collection] Stop listening';
}

export class AddCollection {
  constructor(public collection: CollectionModel, public Userid: number) {}

  static readonly type = '[collection] add collection';

}

export class UpdateCollection {
  constructor(public collection: CollectionModel, public Userid: number) {}

  static readonly type = '[collection] Update collection';

}

export class DeleteCollection {
  constructor(public collectionId: number, public Userid: number) {}

  static readonly type = '[collection] delete collection';

}

export class UpdateCollectionsStore {
  constructor(public collections: CollectionModel[]) {}

  static readonly type = '[collection] Update collections';

}

export class GetCollectionsForUser{
  constructor(public Userid: number){}

  static readonly type = '[collection] get collections for user';
}

export class ListenForCollectionsForUser {
  static readonly type = '[collection] listen for collections for user';
}

export class ListenForErrors {

  static readonly type = '[collection] Listen for errors';

}

export class UpdateError {
  constructor(public errorMessage: string) {}

  static readonly type = '[collection] Update errorMessage';

}




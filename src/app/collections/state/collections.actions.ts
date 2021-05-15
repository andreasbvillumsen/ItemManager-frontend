import {CollectionModel} from '../shared/models/CollectionModel';
import {CreateCollectionDto} from '../shared/dtos/create-collection.dto';
import {UpdateCollectionDto} from '../shared/dtos/update-collection.dto';


export class ListenForCollections {
  static readonly type = '[collection] Listen for collections';
}

export class ListenForOneCollectionWithRelations {
  static readonly type = '[collection] Listen for one collection with relations';
}

export class StopListening {
  static readonly type = '[collection] Stop listening';
}

export class AddCollection {
  constructor(public collectionDto: CreateCollectionDto) {}

  static readonly type = '[collection] add collection';

}

export class UpdateCollection {
  constructor(public collection: UpdateCollectionDto) {}

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

export class UpdateCollectionWithRelationsStore {
  constructor(public collection: CollectionModel) {}

  static readonly type = '[collection] Update collection with relations store';

}

export class GetCollectionsForUser{
  constructor(public Userid: number){}

  static readonly type = '[collection] get collections for user';
}

export class ClearError{
  static readonly type = '[collection] clear error';
}

export class GetAllCollections{
  static readonly type = '[collection] get all collections';
}

export class GetOneCollectionWithRelations{
  constructor(public id: number) {}
  static readonly type = '[collection] get one collection with relations';
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




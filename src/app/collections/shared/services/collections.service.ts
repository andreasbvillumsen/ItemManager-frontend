import { Injectable } from '@angular/core';
import {SocketItemManager} from '../../../app.module';
import {Observable} from 'rxjs';
import {CollectionModel} from '../models/CollectionModel';
import {ReadCollectionDto} from '../dtos/read-collection.dto';
import {map} from 'rxjs/operators';
import {ItemModel} from '../../../items/shared/models/ItemModel';
import {UserModel} from '../../../users/shared/models/UserModel';
import {CreateItemDto} from '../../../items/shared/dtos/create-item.dto';
import {CreateCollectionDto} from '../dtos/create-collection.dto';
import {UpdateCollectionDto} from '../dtos/update-collection.dto';

@Injectable({
  providedIn: 'root'
})
export class CollectionsService {

  constructor(private socket: SocketItemManager) { }

  listenForCollections(): Observable<CollectionModel[]>{
    return this.socket
      .fromEvent<ReadCollectionDto[]>('allCollections').pipe(
        map((readCollectionDtos: ReadCollectionDto[] ) =>
        readCollectionDtos.map(readCollectionDto => ({
          id: readCollectionDto.id,
          name: readCollectionDto.name,
          items: new Array<ItemModel>(),
          users: new Array<UserModel>()

        })))
      );


/*
 id: number;
  name: string;
  items: ItemModel[];
  users: UserModel[];
 .fromEvent<ReadItemDto[]>('allItems').pipe(
        map((readItemDtos: ReadItemDto[] ) =>
          readItemDtos.map(readItemDto => ({
            id: readItemDto.id,
            name: readItemDto.name,
            desc: readItemDto.desc,
            collection: null }) )
      ));*/
  }
  listenForAllCollectionsForUser(): Observable<CollectionModel[]>{
    return this.socket
      .fromEvent<ReadCollectionDto[]>('allCollectionsForUser').pipe(
        map((readCollectionDtos: ReadCollectionDto[] ) =>
          readCollectionDtos.map(readCollectionDto => ({
            id: readCollectionDto.id,
            name: readCollectionDto.name,
            items: new Array<ItemModel>(),
            users: new Array<UserModel>()

          })))
      );

  }
  listenForOneCollection(): Observable<CollectionModel>{
    return this.socket
      .fromEvent<ReadCollectionDto>('oneCollection')
      .pipe(
      map(readCollectionDto => ({
        id: readCollectionDto.id,
        name: readCollectionDto.name,
        items: new Array<ItemModel>(),
        users: new Array<UserModel>()

      }) )
      );

  }

  createCollection(collection: CollectionModel): void {
    const createCollectionDto: CreateCollectionDto = {name: collection.name, items: collection.items, users: collection.users};
    this.socket.emit('createCollection', createCollectionDto);
  }

  updateCollection(collection: CollectionModel): void {
    const updateCollectionDto: UpdateCollectionDto = {id: collection.id ,
      name: collection.name, items: collection.items, users: collection.users};
    this.socket.emit('updateCollection', updateCollectionDto);
  }

  deleteCollection(collectionId: number): void {
    this.socket.emit('deleteCollection', collectionId);
}
  getCollectionsForUser(Userid: number): void {
    this.socket.emit('getCollectionsForUser', Userid);
  }

}

import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {CollectionModel} from '../models/CollectionModel';
import {ReadCollectionDto} from '../dtos/read-collection.dto';
import {map} from 'rxjs/operators';
import {ItemModel} from '../../../items/shared/models/ItemModel';
import {UserModel} from '../../../users/shared/models/UserModel';
import {CreateItemDto} from '../../../items/shared/dtos/create-item.dto';
import {CreateCollectionDto} from '../dtos/create-collection.dto';
import {UpdateCollectionDto} from '../dtos/update-collection.dto';
import {Socket} from 'ngx-socket-io';
import {DeleteCollection} from '../../state/collections.actions';
import {DeleteCollectionDto} from '../dtos/delete-collection.dto';
import {ShareCollectionDto} from '../dtos/share-collection.dto';

@Injectable({
  providedIn: 'root'
})
export class CollectionsService {

  constructor(private socket: Socket) { }

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

    listenForCollectionUpdated(): Observable<CollectionModel>{
        return this.socket
            .fromEvent<ReadCollectionDto>('collectionUpdated').pipe(map(readCollectionDto => ({
                id: readCollectionDto.id,
                name: readCollectionDto.name,
                items: new Array<ItemModel>(),
                users: new Array<UserModel>()
            })));

    }

  listenForOneCollection(): Observable<CollectionModel>{
    return this.socket
      .fromEvent<CollectionModel>('oneCollection');

  }

  createCollection(createCollectionDto: CreateCollectionDto): void {
    console.log(createCollectionDto.name);
    this.socket.emit('createCollection', createCollectionDto);
  }

  updateCollection(updateCollectionDto: UpdateCollectionDto): void {
    this.socket.emit('updateCollection', updateCollectionDto);
  }

  deleteCollection(deleteCollectionDto: DeleteCollectionDto): void {
    this.socket.emit('deleteCollection', deleteCollectionDto);
 }
  getCollectionsForUser(userid: number): void {
      this.socket.emit('findAllCollectionsByUserID', userid);
  }
  getOneCollectionsWithRelations(id: number): void {
      this.socket.emit('findOneCollection', id);
  }
  getAllCollections(): void {
      this.socket.emit('findAllCollections');
  }

  listenForErrors(): Observable<string>{
      return this.socket
          .fromEvent<string>('error');
  }

  disconnect(): void {
    console.log('Disconnected');
    this.socket.disconnect();
  }
  connect(): void {
    console.log('connected');
    this.socket.connect();
  }

  shareCollection(collection: ShareCollectionDto): void {
    this.socket.emit('shareCollection', collection);
  }
}

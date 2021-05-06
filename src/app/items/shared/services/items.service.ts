import { Injectable } from '@angular/core';
import {SocketItemManager} from '../../../app.module';
import {Observable} from 'rxjs';
import {ItemModel} from '../models/ItemModel';
import {ReadItemDto} from '../dtos/read-item.dto';
import {ReadCollectionDto} from '../../../collections/shared/dtos/read-collection.dto';
import {map, tap} from 'rxjs/operators';
import {CollectionModel} from '../../../collections/shared/models/CollectionModel';
import {CreateItemDto} from '../dtos/create-item.dto';
import {UpdateItemDto} from '../dtos/update-item.dto';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  constructor(private socket: SocketItemManager) { }

  listenForItems(): Observable<ItemModel[]>{
    return this.socket
      .fromEvent<ReadItemDto[]>('allItems').pipe(
        map((readItemDtos: ReadItemDto[] ) =>
          readItemDtos.map(readItemDto => ({
            id: readItemDto.id,
            name: readItemDto.name,
            desc: readItemDto.desc,
            collection: null }) )
      ));
  }

  createItem(item: ItemModel): void {
    const createItemDto: CreateItemDto = {name: item.name , desc: item.desc, collection: item.collection};
    this.socket.emit('createItem', createItemDto);
  }

  updateItem(item: ItemModel): void {
    const updateItemDto: UpdateItemDto = {id: item.id, name: item.name , desc: item.desc, collection: item.collection};
    this.socket.emit('updateItem', updateItemDto);

  }

  deleteItem(Itemid: number): void {
    this.socket.emit('deleteItem', Itemid);
  }

  getItemsInCollection(collectionId: number): void {
    this.socket.emit('getItemsInCollection', collectionId);
  }

}

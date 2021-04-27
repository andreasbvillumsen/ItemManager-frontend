import { Injectable } from '@angular/core';
import {SocketItemManager} from '../../../app.module';
import {Observable} from 'rxjs';
import {Item} from '../models/item.model';
import {ItemDto} from '../dtos/item.dto';
import {CollectionDto} from '../../../collections/shared/dtos/collection.dto';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  constructor(private socket: SocketItemManager) { }

  listenForItems(): Observable<Item[]>{
    return this.socket
      .fromEvent<Item[]>('items');

  }

  createItem(dto: ItemDto): void {
    this.socket.emit('createItem', dto);
  }

  updateItem(dto: ItemDto): void {
    this.socket.emit('updateItem', dto);
  }

  deleteItem(dto: ItemDto): void {
    this.socket.emit('deleteItem', dto);
  }

  getItemsInCollection(dto: CollectionDto): void {
    this.socket.emit('getItemsInCollection', dto);
  }

}

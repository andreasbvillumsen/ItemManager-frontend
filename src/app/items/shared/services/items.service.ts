import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {ItemModel} from '../models/ItemModel';
import {ReadItemDto} from '../dtos/read-item.dto';
import {map} from 'rxjs/operators';
import {CreateItemDto} from '../dtos/create-item.dto';
import {UpdateItemDto} from '../dtos/update-item.dto';
import {Socket} from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  constructor(private socket: Socket) { }

  listenForItems(): Observable<ItemModel[]>{
    return this.socket
      .fromEvent<ReadItemDto[]>('allItems').pipe(
        map((readItemDtos: ReadItemDto[] ) =>
          readItemDtos.map(readItemDto => ({
            id: readItemDto.id,
            name: readItemDto.name,
            desc: readItemDto.desc,
            imgName: readItemDto.imgName,
            imgLink: readItemDto.imgLink,
            collection: null }) )
      ));
  }
  listenForItemsInCollection(): Observable<ItemModel[]>{
    return this.socket
      .fromEvent<ReadItemDto[]>('ItemsInCollection').pipe(
        map((readItemDtos: ReadItemDto[] ) =>
          readItemDtos.map(readItemDto => ({
            id: readItemDto.id,
            name: readItemDto.name,
            desc: readItemDto.desc,
            imgName: readItemDto.imgName,
            imgLink: readItemDto.imgLink,
            collection: null }) )
        ));
  }


  createItem(item: CreateItemDto): void {
    this.socket.emit('createItem', item);
  }

  updateItem(item: ItemModel): void {
    const updateItemDto: UpdateItemDto = {
      id: item.id,
      name: item.name,
      desc: item.desc,
      imgName: item.imgName,
      imgLink: item.imgLink,
      collection: item.collection};
    this.socket.emit('updateItem', updateItemDto);

  }

  deleteItem(Item: UpdateItemDto): void {
    this.socket.emit('removeItem', Item);
  }

  getItemsInCollection(collectionId: number): void {
    this.socket.emit('getItemsInCollection', collectionId);
    console.log('emited getItemsInCollection');
  }

  listenForErrors(): Observable<string>{
    return this.socket
        .fromEvent<string>('error');
  }

}

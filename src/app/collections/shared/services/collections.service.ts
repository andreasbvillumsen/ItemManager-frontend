import { Injectable } from '@angular/core';
import {SocketItemManager} from '../../../app.module';
import {Observable} from 'rxjs';
import {Collection} from '../models/collection';

@Injectable({
  providedIn: 'root'
})
export class CollectionsService {

  constructor(private socket: SocketItemManager) { }

  listenForCollections(): Observable<Collection[]>{
    return this.socket
      .fromEvent<Collection[]>('collections');

  }

  createCollection(dto: CollectionDto): void {
    this.socket.emit('collection', dto);
  }

}

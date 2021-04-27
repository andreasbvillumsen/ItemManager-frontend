import { Injectable } from '@angular/core';
import {Collection} from '../models/collection';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollectionsService {

  constructor() { }

  ListenForCollections(): Observable<Collection[]> {

    return null;

  }
}

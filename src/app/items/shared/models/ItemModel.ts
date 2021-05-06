import {CollectionModel} from '../../../collections/shared/models/CollectionModel';

export interface ItemModel{
  id: number;
  desc: string;
  name: string;
  collection?: CollectionModel;

}


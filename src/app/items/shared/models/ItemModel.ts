import {CollectionModel} from '../../../collections/shared/models/CollectionModel';

export interface ItemModel{
  id: number;
  desc: string;
  name: string;
  imgName?: string;
  imgLink?: string;
  collection?: CollectionModel;

}


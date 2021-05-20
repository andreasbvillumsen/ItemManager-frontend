import {CollectionModel} from '../../../collections/shared/models/CollectionModel';

export interface UpdateItemDto  {
  id: number;
  name: string;
  desc: string;
  collection: CollectionModel;
  imgName?: string;
  imgLink?: string;
}

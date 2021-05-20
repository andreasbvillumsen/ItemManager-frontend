import {CollectionModel} from '../../../collections/shared/models/CollectionModel';

export interface CreateItemDto {
  name: string;
  desc: string;
  collection: CollectionModel;
  imgName?: string;
  imgLink?: string;
}

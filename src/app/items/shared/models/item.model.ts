import {Collection} from '../../../collections/shared/models/collection';

export interface Item{
  id: number;
  name: string;
  desc: string;
  collection: Collection;

}


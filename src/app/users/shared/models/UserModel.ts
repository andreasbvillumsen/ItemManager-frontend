import {CollectionModel} from '../../../collections/shared/models/CollectionModel';

export interface UserModel {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  collections: CollectionModel[];


}


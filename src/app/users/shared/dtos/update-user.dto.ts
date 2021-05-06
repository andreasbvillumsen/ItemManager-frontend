import {CollectionModel} from '../../../collections/shared/models/CollectionModel';

export interface UpdateUserDto {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  id: number;
  collections: CollectionModel[];
}

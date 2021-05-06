import {ItemModel} from '../../../items/shared/models/ItemModel';
import {UserModel} from '../../../users/shared/models/UserModel';

export interface CreateCollectionDto {
  name: string;
  items: ItemModel[];
  users: UserModel[];
}

import {Item} from '../../../items/shared/models/item.model';
import {User} from '../../../users/shared/models/user.model';

export interface Collection{
  id: number;
  name: string;
  items: Item[];
  users: User[];

}

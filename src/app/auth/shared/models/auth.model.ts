import {User} from '../../../users/shared/models/user.model';

export interface AuthModel {
  user: User;
  token: string;
}

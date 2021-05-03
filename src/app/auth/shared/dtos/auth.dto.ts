import {User} from '../../../users/shared/models/user.model';

export interface AuthDto {
  user: User;
  token: string;
}

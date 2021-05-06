import {UserModel} from '../../../users/shared/models/UserModel';

export interface AuthDto {
  user: UserModel;
  token: string;
}

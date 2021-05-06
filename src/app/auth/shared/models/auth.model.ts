import {UserModel} from '../../../users/shared/models/UserModel';

export interface AuthModel {
  user: UserModel;
  token: string;
}

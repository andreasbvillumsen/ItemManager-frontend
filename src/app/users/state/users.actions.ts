import {UserModel} from '../shared/models/UserModel';
/*
export class Login{
  constructor(public loginDTO: LoginDto) {}

  static readonly type = '[loginDTO] login user';
}*/

export class CreateUser {
  constructor(public user: UserModel) {}

  static readonly type = '[ReadUserDto] create user';

}

export class UpdateUser {
  constructor(public user: UserModel) {}

  static readonly type = '[ReadUserDto] Update user';

}

export class DeleteUser {
  constructor(public userId: number) {}

  static readonly type = '[ReadUserDto] delete user';

}



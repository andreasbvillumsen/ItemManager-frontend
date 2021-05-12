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

export class StopListening {

  static readonly type = '[ReadUserDto] stop listening';

}

export class ClearError{
  static readonly type = '[collection] clear error';
}

export class ListenForErrors {

  static readonly type = '[ReadUserDto] Listen for errors';

}

export class UpdateError {
  constructor(public errorMessage: string) {}

  static readonly type = '[ReadUserDto] Update errorMessage';

}



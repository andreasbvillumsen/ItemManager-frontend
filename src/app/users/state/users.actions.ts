
import {UserDto} from '../shared/dtos/user.dto';
/*
export class Login{
  constructor(public loginDTO: LoginDto) {}

  static readonly type = '[loginDTO] login user';
}*/

export class CreateUser {
  constructor(public user: UserDto) {}

  static readonly type = '[UserDto] create user';

}

export class UpdateUser {
  constructor(public user: UserDto) {}

  static readonly type = '[UserDto] Update user';

}

export class DeleteUser {
  constructor(public user: UserDto) {}

  static readonly type = '[UserDto] delete user';

}



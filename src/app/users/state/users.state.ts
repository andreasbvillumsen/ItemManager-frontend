import {User} from '../shared/models/user.model';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {Subscription} from 'rxjs';
import {UsersService} from '../shared/services/users.service';
import {Login} from './users.actions';
import {CollectionsStateModel} from '../../collections/state/collections.state';
import {Collection} from '../../collections/shared/models/collection';

export interface UsersStateModel{
  User: User;
}

@State<UsersStateModel>({
  name: 'users',
  defaults: {
    User: null
  }
})
@Injectable()
export class UsersState{
  initSub: Subscription | undefined;

  constructor(private usersService: UsersService) {
  }

  @Selector()
  static User(state: UsersStateModel): User {
    return state.User;
  }
/*
  @Action(Login)
  Login(ctx: StateContext<UsersStateModel>): void {

  }
*/

}
 /*
 export class Login{
  constructor(public loginDTO: LoginDto) {}

  static readonly type = '[loginDTO] login user';
}

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
 */

import {User} from '../shared/models/user.model';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {Subscription} from 'rxjs';
import {UsersService} from '../shared/services/users.service';
import {CollectionsStateModel} from '../../collections/state/collections.state';
import {Collection} from '../../collections/shared/models/collection';
import {CreateUser, DeleteUser, UpdateUser} from './users.actions';
import {ItemsStateModel} from '../../items/state/items.state';

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

  @Action(CreateUser)
  CreateUser(ctx: StateContext<UsersStateModel>, action: CreateUser): void {
    this.usersService.createUser(action.user);

  }

  @Action(UpdateUser)
  UpdateUser(ctx: StateContext<UsersStateModel>, action: UpdateUser): void {
    this.usersService.updateUser(action.user);

  }

  @Action(DeleteUser)
  DeleteUser(ctx: StateContext<UsersStateModel>, action: DeleteUser): void {
    this.usersService.deleteUser(action.user);

  }

}

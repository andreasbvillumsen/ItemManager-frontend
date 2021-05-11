import {UserModel} from '../shared/models/UserModel';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {UsersService} from '../shared/services/users.service';
import {CollectionsStateModel} from '../../collections/state/collections.state';
import {CollectionModel} from '../../collections/shared/models/CollectionModel';
import {CreateUser, DeleteUser, ListenForErrors, StopListening, UpdateError, UpdateUser} from './users.actions';
import {ItemsStateModel} from '../../items/state/items.state';
import {takeUntil} from 'rxjs/operators';

export interface UsersStateModel{
  User: UserModel;
  errorMessage: string;
}

@State<UsersStateModel>({
  name: 'users',
  defaults: {
    User: null,
    errorMessage: undefined
  }
})
@Injectable()
export class UsersState{
  unsubscriber$ = new Subject();

  constructor(private usersService: UsersService) {
  }

  @Selector()
  static User(state: UsersStateModel): UserModel {
    return state.User;
  }

  @Selector()
  static error(state: UsersStateModel): string {
    return state.errorMessage;
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
    this.usersService.deleteUser(action.userId);

  }

  @Action(ListenForErrors)
  listenForErrors(ctx: StateContext<UsersStateModel>): void {
    this.usersService.listenForErrors()
        .pipe(
            takeUntil(this.unsubscriber$)
        )
        .subscribe(error => {
          ctx.dispatch(new UpdateError(error));
        });
  }

  @Action(UpdateError)
  updateError(ctx: StateContext<UsersStateModel>, action: UpdateError): void {
    const state = ctx.getState();
    const newState: UsersStateModel = {
      ...state,
      errorMessage: action.errorMessage
    };
    ctx.setState(newState);
  }

  @Action(StopListening)
  stopListening(ctx: StateContext<UsersStateModel>): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

}

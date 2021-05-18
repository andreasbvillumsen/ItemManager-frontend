import {AuthModel} from '../shared/models/auth.model';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {SetAuth} from './auth.actions';

export interface AuthStateModel {
  auth: AuthModel;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    auth: null
  }
})

@Injectable()
export class AuthState {
  @Selector()
  static auth(state: AuthStateModel): AuthModel {
    return state.auth;
  }

  @Action(SetAuth)
  setAuth(ctx: StateContext<AuthStateModel>, sa: SetAuth): void {
    const newState: AuthStateModel = {
      auth: sa.auth
    };
    ctx.setState(newState);
  }
}

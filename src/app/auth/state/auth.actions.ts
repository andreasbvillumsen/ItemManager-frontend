import {AuthModel} from '../shared/models/auth.model';

export class SetAuth {
  constructor(public auth: AuthModel) {
    console.log('Got to constructor');
  }

  static readonly type = '[Auth] Set Auth';
}

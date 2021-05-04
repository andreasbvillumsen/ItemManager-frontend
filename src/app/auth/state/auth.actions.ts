import {AuthModel} from '../shared/models/auth.model';

export class ListenForAuth {
  static readonly type = '[Auth] Listen For Auth';
}

export class SetAuth {
  constructor(public auth: AuthModel) {}

  static readonly type = '[Auth] Set Auth';
}

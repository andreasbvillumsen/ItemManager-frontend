import {AuthModel} from '../shared/models/auth.model';

export class SetAuth {
  constructor(public auth: AuthModel) {}

  static readonly type = '[Auth] Set Auth';
}

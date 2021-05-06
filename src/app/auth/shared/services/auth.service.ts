import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserModel} from '../../../users/shared/models/UserModel';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {LoginDto} from '../dtos/login.dto';
import {RegisterDto} from '../dtos/register.dto';
import {AuthState} from '../../state/auth.state';
import {AuthModel} from '../models/auth.model';
import {Select, Store} from '@ngxs/store';
import {SetAuth} from '../../state/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  @Output() user: EventEmitter<UserModel> = new EventEmitter();
  @Select(AuthState.auth) auth$: Observable<AuthModel> | undefined;

  constructor(private http: HttpClient, private store: Store) {}

  // Check if we can log in user. If we can, then we store the token and username in local storage.
  login(loginDto: LoginDto): Observable<boolean> {
    return this.http.post<any>(environment.apiUrl + '/auth/login', loginDto)
      .pipe(map(response => {
        const token = response.token;
        const user: UserModel = response.user;
        const authModel: AuthModel = { user, token };
        // login successful if there's a jwt token in the response
        if (token) {
          this.store.dispatch(new SetAuth(authModel));

          // store username and jwt token in local storage to keep user logged in between page refreshes
          // localStorage.setItem('currentUser', JSON.stringify({ user, token }));
          this.user.emit(user);
          // return true to indicate successful login
          return true;
        } else {
          // return false to indicate failed login
          return false;
        }
      }));
  }

  register(registerDto: RegisterDto): Observable<boolean> {
    return this.http.post<any>(environment.apiUrl + '/auth/register', registerDto)
      .pipe(map(response => {
        const token = response.token;
        const user: UserModel = response.user;
        const authModel: AuthModel = { user, token };
        // register successful if there's a jwt token in the response
        if (token) {
          this.store.dispatch(new SetAuth(authModel));

          // store username and jwt token in local storage to keep user logged in between page refreshes
          // localStorage.setItem('currentUser', JSON.stringify({ user, token }));
          this.user.emit(user);
          // return true to indicate successful register login
          return true;
        } else {
          // return false to indicate failed registering
          return false;
        }
      }));
  }

  logout(): void {
    // remove user's token from local storage to log user out
    // localStorage.removeItem('currentUser');
    this.store.dispatch(new SetAuth(null));
    this.user.emit(null);
  }
}

import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../../../users/shared/models/user.model';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {LoginDto} from '../dtos/login.dto';
import {RegisterDto} from '../dtos/register.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  @Output() user: EventEmitter<User> = new EventEmitter();

  constructor(private http: HttpClient) {}

  // Check if we can log in user. If we can, then we store the token and username in local storage.
  login(loginDto: LoginDto): Observable<boolean> {
    return this.http.post<any>(environment.apiUrl + '/auth/login', loginDto)
      .pipe(map(response => {
        const token = response.token;
        const user: User = response.user;
        // login successful if there's a jwt token in the response
        if (token) {
          // store username and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify({ user, token }));
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
        const user: User = response.user;
        // register successful if there's a jwt token in the response
        if (token) {
          // store username and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify({ user, token }));
          this.user.emit(user);
          // return true to indicate successful register login
          return true;
        } else {
          // return false to indicate failed registering
          return false;
        }
      }));
  }

  // Get user's token from local storage
  getToken(): string {
    // Get the logged in user from local storage.
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // Check if there is a logged in user.
    if (currentUser) {
      // There is a logged in user, so we return the requested token.
      return currentUser.token;
    } else {
      // There is no logged in user, we return null.
      return null;
    }
  }

  // Get user's username from local storage
  getUser(): User {
    // Get the logged in user from local storage.
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // Check if there is a logged in user.
    if (currentUser) {
      const user: User = currentUser.user;
      // There is a logged in user, so we return the requested username.
      return user;
    }
    else {
      // There is no logged in user, we return null.
      return null;
    }
  }

  userIsLoggedIn(): boolean {
    if (this.getUser() !== null) { return true; }

    return false;
  }

  logout(): void {
    // remove user's token from local storage to log user out
    localStorage.removeItem('currentUser');
    this.user.emit(null);
  }
}

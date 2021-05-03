import { Injectable } from '@angular/core';
import {SocketItemManager} from '../../../app.module';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Item} from '../../../items/shared/models/item.model';
import {UserDto} from '../dtos/user.dto';
import {LoginDto} from '../../../auth/shared/dtos/login.dto';
import {environment} from '../../../../environments/environment.prod';
import {map} from 'rxjs/operators';
import {stringify} from 'querystring';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private socket: SocketItemManager,
              private http: HttpClient) { }

  login(dto: LoginDto): Observable<boolean> {
    return this.http.post<any>(environment.backendUrl + 'auth/login', dto)
      .pipe(map(response => {
        const token = response.token;
        if (token)
        {
          const email = dto.email;
          localStorage.setItem('currentUser', JSON.stringify({email, token}));

          return true;
        }else {
          return false;
        }
      }));
  }

  createUser(dto: UserDto): void {
    this.socket.emit('createuser', dto);
  }

  updateUser(dto: UserDto): void {
    this.socket.emit('updateUser', dto);
  }

  deleteUser(dto: UserDto): void {
    this.socket.emit('deleteUser', dto);
  }



}

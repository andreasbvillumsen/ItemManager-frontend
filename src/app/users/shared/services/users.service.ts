import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ReadUserDto} from '../dtos/read-user.dto';
import {LoginDto} from '../../../auth/shared/dtos/login.dto';
import {environment} from '../../../../environments/environment.prod';
import {map} from 'rxjs/operators';
import {stringify} from 'querystring';
import {UserModel} from '../models/UserModel';
import {CollectionModel} from '../../../collections/shared/models/CollectionModel';
import {CreateCollectionDto} from '../../../collections/shared/dtos/create-collection.dto';
import {CreateUser} from '../../state/users.actions';
import {CreateUserDto} from '../dtos/create-user.dto';
import {UpdateUserDto} from '../dtos/update-user.dto';
import {Socket} from 'ngx-socket-io';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private socket: Socket,
              private http: HttpClient) {
  }

  /*
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
    */

  ListenForUsers(): Observable<UserModel[]> {
    return this.socket
      .fromEvent<ReadUserDto[]>('allUsers').pipe(
        map((ReadUserDtos: ReadUserDto[]) =>
          ReadUserDtos.map(readUserDto => ({
              id: readUserDto.id,
              email: readUserDto.email,
              firstName: readUserDto.firstname,
              lastName: readUserDto.lastname,
              password: '',
              collections: new Array<CollectionModel>()
            })
          )));
  }

  createUser(user: UserModel): void {
    const createUserDto: CreateUserDto = {email: user.email, firstname: user.firstName, lastname: user.lastName, password: user.password};
    this.socket.emit('createuser', createUserDto);
  }

  updateUser(user: UserModel): void {
    const updateUserDto: UpdateUserDto = {id: user.id, email: user.email, firstname: user.firstName, lastname: user.lastName, password:
      user.password, collections: user.collections};
    this.socket.emit('updateUser', updateUserDto);
  }

  deleteUser(usrId: number): void {
    this.socket.emit('deleteUser', usrId);
  }

  listenForErrors(): Observable<string>{
      return this.socket
          .fromEvent<string>('error');
  }


}

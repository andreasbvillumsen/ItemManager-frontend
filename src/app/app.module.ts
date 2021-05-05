import {Injectable, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {Socket, SocketIoModule} from 'ngx-socket-io';
import {environment} from '../environments/environment';
import {NgxsLoggerPluginModule} from '@ngxs/logger-plugin';
import {NgxsModule} from '@ngxs/store';
import { AuthComponent } from './auth/auth.component';
import {NgxsStoragePluginModule} from '@ngxs/storage-plugin';


@Injectable()
export class SocketItemManager extends Socket {

  constructor() {
    super({url: 'http://localhost:3000/', options: {}});
  }
}

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule,
    NgxsModule.forRoot([], {
      developmentMode: !environment.production
    }),
    NgxsLoggerPluginModule.forRoot(),
    NgxsStoragePluginModule.forRoot()
  ],
  providers: [SocketItemManager],
  bootstrap: [AppComponent]
})
export class AppModule { }

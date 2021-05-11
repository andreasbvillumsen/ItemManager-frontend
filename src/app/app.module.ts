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
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ItemsShowComponent } from './items/items-show/items-show.component';


@Injectable()
export class SocketItemManager extends Socket {

  constructor() {
    super({url: 'http://localhost:3000/', options: {}});
  }
}

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LandingPageComponent,
    LoginComponent,
    RegisterComponent,
    ItemsShowComponent,
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

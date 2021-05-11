import { Component, OnInit } from '@angular/core';
import {Store} from '@ngxs/store';
import {AuthModel} from '../auth/shared/models/auth.model';
import {AuthState} from '../auth/state/auth.state';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit {
  auth$: Observable<AuthModel>;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.auth$ = this.store.select(AuthState.auth)
  }

  getAuth(): Observable<AuthModel> {
    return this.store.select(AuthState.auth);
  }

}

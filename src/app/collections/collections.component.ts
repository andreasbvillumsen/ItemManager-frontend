import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {AuthModel} from '../auth/shared/models/auth.model';
import {AuthState} from '../auth/state/auth.state';
import {Observable} from 'rxjs';
import {CollectionState} from './state/collections.state';
import {CollectionModel} from './shared/models/CollectionModel';
import {GetCollectionsForUser, ListenForCollectionsForUser, StopListeningForCollectionsForUser} from './state/collections.actions';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit, OnDestroy {
  @Select(CollectionState.Collections)
  collections$: Observable<CollectionModel[]>;
  auth$: Observable<AuthModel>;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new ListenForCollectionsForUser());
    this.auth$ = this.store.select(AuthState.auth);
    this.auth$.pipe(take(1)).subscribe(auth => {
      this.store.dispatch(new GetCollectionsForUser(auth.user.id));
    });
  }

  getAuth(): Observable<AuthModel> {
    return this.store.select(AuthState.auth);
  }

  ngOnDestroy(): void {
    this.store.dispatch(new StopListeningForCollectionsForUser());
  }

}

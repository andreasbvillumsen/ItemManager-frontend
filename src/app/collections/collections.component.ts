import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {AuthModel} from '../auth/shared/models/auth.model';
import {AuthState} from '../auth/state/auth.state';
import {Observable, Subject} from 'rxjs';
import {CollectionState} from './state/collections.state';
import {CollectionModel} from './shared/models/CollectionModel';
import {
  GetAllCollections,
  GetCollectionsForUser,
  ListenForCollections,
  ListenForCollectionsForUser, ListenForErrors, StopListening,
} from './state/collections.actions';
import {take, takeUntil} from 'rxjs/operators';
import {CollectionsService} from './shared/services/collections.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit, OnDestroy {
  unsubscriber$ = new Subject();
  @Select(CollectionState.error)
  errorMessage$: Observable<string>;
  errorMessage: string | undefined;
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
    this.store.dispatch(new ListenForErrors());
    this.errorMessage$
        .pipe(takeUntil(this.unsubscriber$))
        .subscribe(error => {
          this.errorMessage = error;
        });

  }

  getAuth(): Observable<AuthModel> {
    return this.store.select(AuthState.auth);
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
    this.store.dispatch(new StopListening());
  }

}

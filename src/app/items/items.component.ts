import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {CollectionState} from '../collections/state/collections.state';
import {CollectionModel} from '../collections/shared/models/CollectionModel';
import {AuthModel} from '../auth/shared/models/auth.model';
import {GetAllCollections, ListenForCollections, ListenForErrors, StopListening} from '../collections/state/collections.actions';
import {takeUntil} from 'rxjs/operators';
import {AuthState} from '../auth/state/auth.state';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent  implements OnInit, OnDestroy {
  unsubscriber$ = new Subject();
  @Select(CollectionState.error)
  errorMessage$: Observable<string>;
  errorMessage: string | undefined;
  @Select(CollectionState.Collections)
  collections$: Observable<CollectionModel[]>;
  auth$: Observable<AuthModel>;

  constructor(private store: Store) { }

  ngOnInit(): void {
    /*
    this.store.dispatch(new ListenForCollectionsForUser());
    this.auth$ = this.store.select(AuthState.auth);
    this.auth$.pipe(take(1)).subscribe(auth => {
       this.store.dispatch(new GetCollectionsForUser(auth.user.id));
    });*/
    this.store.dispatch(new ListenForErrors());
    this.errorMessage$
        .pipe(takeUntil(this.unsubscriber$))
        .subscribe(error => {
          this.errorMessage = error;
        });
    this.store.dispatch(new ListenForCollections());
    this.store.dispatch(new GetAllCollections());
  }

  getAuth(): Observable<AuthModel> {
    return this.store.select(AuthState.auth);
  }

  ngOnDestroy(): void {
    this.store.dispatch(new StopListening());
  }

}

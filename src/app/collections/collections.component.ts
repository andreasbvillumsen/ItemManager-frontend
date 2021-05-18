import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {AuthModel} from '../auth/shared/models/auth.model';
import {AuthState} from '../auth/state/auth.state';
import {Observable, Subject} from 'rxjs';
import {CollectionState} from './state/collections.state';
import {CollectionModel} from './shared/models/CollectionModel';
import {
  ClearError,
  GetAllCollections,
  GetCollectionsForUser,
  ListenForCollections,
  ListenForCollectionsForUser, ListenForErrors, StopListening,
} from './state/collections.actions';
import {take, takeUntil} from 'rxjs/operators';
import {CollectionsService} from './shared/services/collections.service';
import {ItemState} from '../items/state/items.state';
import {ItemModel} from '../items/shared/models/ItemModel';
import {ItemsInCollection, ListenForItems} from '../items/state/items.actions';
import {SetAuth} from '../auth/state/auth.actions';
import {Router} from '@angular/router';

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
  @Select(ItemState.items)
  items$: Observable<ItemModel[]>;
  profileOpened = false;

  currentCollection: CollectionModel | undefined;

  constructor(private store: Store, private router: Router) { }

  ngOnInit(): void {

    this.store.dispatch(new ListenForCollectionsForUser());
    this.store.dispatch(new ListenForItems());
    this.auth$ = this.store.select(AuthState.auth);
    this.auth$.pipe(take(1)).subscribe(auth => {
       this.store.dispatch(new GetCollectionsForUser(auth.user.id));
    });
    this.store.dispatch(new ListenForErrors());
    this.errorMessage$
        .pipe(takeUntil(this.unsubscriber$))
        .subscribe(error => {
          this.store.dispatch(new ClearError());
          this.errorMessage = error;
        });
  }

  getAuth(): Observable<AuthModel> {
    return this.store.select(AuthState.auth);
  }

  selectCollection(collection: CollectionModel): void{
    this.currentCollection = collection;
    this.store.dispatch(new ItemsInCollection(collection.id));
  }

  ngOnDestroy(): void {
    console.log('Destroyed');
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
    this.store.dispatch(new StopListening());
  }

  toggleProfileOpened(): void {
    this.profileOpened = !this.profileOpened;
  }

  logout(): void {
    this.store.dispatch(new SetAuth(null));
    this.router.navigate(['/']);
  }
}

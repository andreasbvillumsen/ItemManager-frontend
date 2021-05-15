import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {AuthModel} from '../auth/shared/models/auth.model';
import {AuthState} from '../auth/state/auth.state';
import {Observable, Subject} from 'rxjs';
import {CollectionState} from './state/collections.state';
import {CollectionModel} from './shared/models/CollectionModel';
import {
  AddCollection,
  ClearError,
  GetAllCollections,
  GetCollectionsForUser, GetOneCollectionWithRelations,
  ListenForCollections,
  ListenForCollectionsForUser, ListenForErrors, ListenForOneCollectionWithRelations, StopListening, UpdateCollection,
} from './state/collections.actions';
import {first, take, takeUntil} from 'rxjs/operators';
import {CollectionsService} from './shared/services/collections.service';
import {ItemState} from '../items/state/items.state';
import {ItemModel} from '../items/shared/models/ItemModel';
import {ItemsInCollection, ListenForItems} from '../items/state/items.actions';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {CreateCollectionDto} from './shared/dtos/create-collection.dto';
import {UpdateCollectionDto} from './shared/dtos/update-collection.dto';

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
  newCollection: boolean;
  submittedCreate: boolean;
  submittedEdit: boolean;
  editCollection: boolean;
  collectionCreateFG = new FormGroup({
    nameCreateFC: new FormControl('', Validators.required)
  });
  collectionEditFG = new FormGroup({
    nameEditFC: new FormControl('', Validators.required)
  });
  @Select(CollectionState.collection)
  collection$: Observable<CollectionModel>;

  currentCollection: CollectionModel | undefined;

  constructor(private store: Store) { }

  get nameCreateFC(): AbstractControl{
    return this.collectionCreateFG.get('nameCreateFC');
  }

  get nameEditFC(): AbstractControl{
    return this.collectionEditFG.get('nameEditFC');
  }

  ngOnInit(): void {

    this.store.dispatch(new ListenForCollectionsForUser());
    this.store.dispatch(new ListenForItems());
    this.store.dispatch(new ListenForOneCollectionWithRelations());
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
    this.newCollection = false;
    this.submittedCreate = false;
    this.editCollection = false;
    this.submittedEdit = false;
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

  createCollection(): void {
    this.submittedCreate = true;
    if (this.collectionCreateFG.valid){
      this.auth$.pipe(take(1)).subscribe(auth => {
        const newCollectionDto: CreateCollectionDto = {name: this.nameCreateFC.value, users: [auth.user]};
        this.store.dispatch(new AddCollection(newCollectionDto));
      });

      this.submittedCreate = false;
      this.newCollection = false;
      this.nameCreateFC.reset();
    }

  }

  updateCollection(): void{
    this.submittedEdit = true;
    if (this.collectionEditFG.valid){
      this.auth$.pipe(take(1)).subscribe(auth => {
        this.store.dispatch(new GetOneCollectionWithRelations(this.currentCollection.id));
        this.collection$.pipe(first(col => col !== undefined)).subscribe(collection => {
          const updateCollectionDto: UpdateCollectionDto = {
            id: collection.id,
            name: this.nameEditFC.value,
            users: collection.users,
            items: collection.items,
            userid: auth.user.id};
          console.log(updateCollectionDto);
          this.store.dispatch(new UpdateCollection(updateCollectionDto));
        });
    });

      this.submittedEdit = false;
      this.editCollection = false;
      this.nameEditFC.reset();
  }
  }


}

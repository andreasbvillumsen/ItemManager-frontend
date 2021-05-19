import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {AuthModel} from '../auth/shared/models/auth.model';
import {AuthState} from '../auth/state/auth.state';
import {Observable, Subject} from 'rxjs';
import {CollectionState} from './state/collections.state';
import {CollectionModel} from './shared/models/CollectionModel';
import {
  AddCollection,
  ClearError, DeleteCollection,
  GetAllCollections,
  GetCollectionsForUser,
  GetOneCollectionWithRelations,
  ListenForCollectionsForUser,
  ListenForCollectionUpdated,
  ListenForErrors,
  ListenForOneCollectionWithRelations,
  StopListening,
  UpdateCollection,
} from './state/collections.actions';
import {filter, first, take, takeUntil} from 'rxjs/operators';
import {ItemState} from '../items/state/items.state';
import {ItemModel} from '../items/shared/models/ItemModel';
import {AddItem, ItemsInCollection, ListenForItemsInCollection} from '../items/state/items.actions';
import {SetAuth} from '../auth/state/auth.actions';
import {Router} from '@angular/router';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {CreateCollectionDto} from './shared/dtos/create-collection.dto';
import {UpdateCollectionDto} from './shared/dtos/update-collection.dto';
import {CreateItemDto} from '../items/shared/dtos/create-item.dto';
import {DeleteCollectionDto} from './shared/dtos/delete-collection.dto';

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
  @Select(CollectionState.updatedCollection)
  updatedCollection$: Observable<CollectionModel>;
  newCollection: boolean;
  submittedCreate: boolean;
  submittedEdit: boolean;
  editCollection: boolean;
  deleteDialog: boolean;
  profileOpened = false;
  newItem = false;
  collectionCreateFG = new FormGroup({
    nameCreateFC: new FormControl('', Validators.required)
  });
  collectionEditFG = new FormGroup({
    nameEditFC: new FormControl('', Validators.required)
  });
  @Select(CollectionState.collection)
  collection$: Observable<CollectionModel>;

  createItemFG = new FormGroup({
    itemNameFC: new FormControl('', Validators.required),
    itemDescFC: new FormControl('', Validators.required)
  });

  currentCollection: CollectionModel | undefined;
  selectedItem: ItemModel | undefined;

  constructor(private store: Store, private router: Router) { }

  get nameCreateFC(): AbstractControl{
    return this.collectionCreateFG.get('nameCreateFC');
  }

  get nameEditFC(): AbstractControl{
    return this.collectionEditFG.get('nameEditFC');
  }

  ngOnInit(): void {
    this.store.dispatch(new ListenForCollectionsForUser());
    this.store.dispatch(new ListenForItemsInCollection());
    this.store.dispatch(new ListenForOneCollectionWithRelations());
    this.store.dispatch(new ListenForCollectionUpdated());
    this.updatedCollection$
        .pipe(
            takeUntil(this.unsubscriber$)
        )
        .subscribe( updatedCollection => {
          this.selectCollection(updatedCollection);
        });

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

    this.deleteDialog = false;
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
    if (this.currentCollection !== undefined){
      this.store.dispatch(new ItemsInCollection(collection.id));
    }
    this.onCancel();
    this.deleteDialog = false;
  }

  selectItem(): void
  {

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
      const newName = this.nameEditFC.value;
      this.auth$.pipe(take(1)).subscribe(auth => {
        this.store.dispatch(new GetOneCollectionWithRelations(this.currentCollection.id));
        this.collection$.pipe(first(col => col !== undefined && col.id === this.currentCollection.id)).subscribe(collection => {
          const updateCollectionDto: UpdateCollectionDto = {
            id: collection.id,
            name: newName,
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

  deleteCollection(collectionId: number): void {
    this.deleteDialog = false;
    this.auth$
        .pipe(take(1))
        .subscribe(auth => {
          const deleteCollection: DeleteCollectionDto = {
            collectionId,
            userId: auth.user.id


          };
          this.store.dispatch(new DeleteCollection(deleteCollection));
        });
    this.currentCollection = undefined;
  }

  showDeleteDialog(): void {
    this.deleteDialog = true;
  }

  clearError(): void {
    this.store.dispatch(new ClearError());

  }

  onCancel(): void {
    if (this.newCollection) {
      this.newCollection = false;
      this.nameCreateFC.reset();
    } else if (this.editCollection) {
      this.editCollection = false;
      this.nameEditFC.reset();
    }
  }

  createNewItem(): void {
    if (this.createItemFG.valid) {
      this.auth$.pipe(take(1)).subscribe(auth => {
        const newItemDto: CreateItemDto = {
          name: this.createItemFG.get('itemNameFC').value,
          desc: this.createItemFG.get('itemDescFC').value,
          collection: this.currentCollection};
        this.store.dispatch(new AddItem(newItemDto));
      });
      this.createItemFG.reset();
      this.newItem = false;
    }
  }

  cancelNewItem(): void {
    this.newItem = false;
    this.createItemFG.reset();
  }

  onCancelDelete(): void {
    this.deleteDialog = false;
  }
}

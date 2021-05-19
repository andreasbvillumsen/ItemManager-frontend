import {CollectionModel} from '../shared/models/CollectionModel';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {CollectionsService} from '../shared/services/collections.service';
import {
  AddCollection,
  ClearError,
  DeleteCollection,
  GetAllCollections,
  GetCollectionsForUser,
  GetOneCollectionWithRelations,
  ListenForCollections,
  ListenForCollectionsForUser,
  ListenForCollectionUpdated,
  ListenForErrors,
  ListenForOneCollectionWithRelations, ShareCollection,
  StopListening,
  UpdateCollection,
  UpdateCollectionsStore,
  UpdateCollectionWithRelationsStore,
  UpdateError, UpdateStoreWithUpdatedCollection
} from './collections.actions';
import {takeUntil} from 'rxjs/operators';
import {ShareCollectionDto} from '../shared/dtos/share-collection.dto';

export interface CollectionsStateModel{
  collections: CollectionModel[];
  errorMessage: string;
  collection: CollectionModel;
  updatedCollection: CollectionModel;
}

@State<CollectionsStateModel>({
  name: 'collection',
  defaults: {
    collections: [],
    errorMessage: undefined,
    collection: undefined,
    updatedCollection: undefined
  }
})
@Injectable()
export class CollectionState {
  unsubscriber$ = new Subject();

  constructor(private collectionsService: CollectionsService) {
  }

  @Selector()
  static Collections(state: CollectionsStateModel): CollectionModel[] {
    return state.collections;
  }

  @Selector()
  static collection(state: CollectionsStateModel): CollectionModel {
    return state.collection;
  }

  @Selector()
  static updatedCollection(state: CollectionsStateModel): CollectionModel {
    return state.updatedCollection;
  }

  @Selector()
  static error(state: CollectionsStateModel): string {
    return state.errorMessage;
  }

  @Action(ListenForCollections)
  listenForCollections(ctx: StateContext<CollectionsStateModel>): void {
    this.collectionsService.listenForCollections()
        .pipe(takeUntil(this.unsubscriber$))
      .subscribe(collections => {
        ctx.dispatch(new UpdateCollectionsStore(collections));
      });
  }

  @Action(ListenForCollectionUpdated)
  listenForCollectionUpdated(ctx: StateContext<CollectionsStateModel>): void {
    this.collectionsService.listenForCollectionUpdated()
        .pipe(takeUntil(this.unsubscriber$))
        .subscribe(collection => {
          ctx.dispatch(new UpdateStoreWithUpdatedCollection(collection));
        });
  }

  @Action(ListenForOneCollectionWithRelations)
  listenForCollectionWithRelations(ctx: StateContext<CollectionsStateModel>): void {
    this.collectionsService.listenForOneCollection()
        .pipe(takeUntil(this.unsubscriber$))
      .subscribe(collection => {
        ctx.dispatch(new UpdateCollectionWithRelationsStore(collection));
      });
  }

  @Action(StopListening)
  stopListening(ctx: StateContext<CollectionsStateModel>): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

  @Action(AddCollection)
  addCollection(ctx: StateContext<CollectionsStateModel> , action: AddCollection): void {
    this.collectionsService.createCollection(action.collectionDto);


  }

  @Action(UpdateCollection)
  updateCollection(ctx: StateContext<CollectionsStateModel> , action: UpdateCollection): void {
    this.collectionsService.updateCollection(action.collection);


  }
  @Action(ShareCollection)
  shareCollection(ctx: StateContext<CollectionsStateModel>, action: ShareCollection): void {
    this.collectionsService.shareCollection(action.collection);
  }

  @Action(DeleteCollection)
  deleteCollection(ctx: StateContext<CollectionsStateModel> , action: DeleteCollection): void {
    this.collectionsService.deleteCollection(action.deleteCollection);


  }

  @Action(UpdateCollectionsStore)
  updateCollections(ctx: StateContext<CollectionsStateModel>, action: UpdateCollectionsStore): void {
    const state = ctx.getState();
    const newState: CollectionsStateModel = {
      ...state,
      collections: action.collections
    };
    ctx.setState(newState);
  }

  @Action(UpdateStoreWithUpdatedCollection)
  updateStoreWithUpdatedCollection(ctx: StateContext<CollectionsStateModel>, action: UpdateStoreWithUpdatedCollection): void {
    const state = ctx.getState();
    const newState: CollectionsStateModel = {
      ...state,
      updatedCollection: action.updatedCollection
    };
    ctx.setState(newState);
  }

  @Action(UpdateCollectionWithRelationsStore)
  updateCollectionWithRelation(ctx: StateContext<CollectionsStateModel>, action: UpdateCollectionWithRelationsStore): void {
    const state = ctx.getState();
    const newState: CollectionsStateModel = {
      ...state,
      collection: action.collection
    };
    ctx.setState(newState);
  }

  @Action(GetCollectionsForUser)
  getCollectionsForUser(ctx: StateContext<CollectionsStateModel>, action: GetCollectionsForUser): void{
    this.collectionsService.getCollectionsForUser(action.Userid);

  }

  @Action(GetAllCollections)
  getAllCollections(ctx: StateContext<CollectionsStateModel>): void{
    this.collectionsService.getAllCollections();

  }

  @Action(GetOneCollectionWithRelations)
  getOneCollectionWithRelations(ctx: StateContext<CollectionsStateModel>, action: GetOneCollectionWithRelations): void{
    this.collectionsService.getOneCollectionsWithRelations(action.id);

  }

  @Action(ListenForCollectionsForUser)
  listenForCollectionsForUser(ctx: StateContext<CollectionsStateModel>, action: ListenForCollectionsForUser): void {
    this.collectionsService.listenForAllCollectionsForUser()
        .pipe(takeUntil(this.unsubscriber$))
        .subscribe(collections => {
          ctx.dispatch(new UpdateCollectionsStore(collections));
        });
  }

  @Action(ListenForErrors)
  listenForErrors(ctx: StateContext<CollectionsStateModel>): void {
    this.collectionsService.listenForErrors()
        .pipe(
            takeUntil(this.unsubscriber$)
        )
        .subscribe(error => {
          ctx.dispatch(new UpdateError(error));
        });
  }

  @Action(ClearError)
  clearError(ctx: StateContext<CollectionsStateModel>): void {
    const state = ctx.getState();
    const newState: CollectionsStateModel = {
      ...state,
      errorMessage: undefined
    };
    ctx.setState(newState);
  }

  @Action(UpdateError)
  updateError(ctx: StateContext<CollectionsStateModel>, action: UpdateError): void {
    const state = ctx.getState();
    const newState: CollectionsStateModel = {
      ...state,
      errorMessage: action.errorMessage
    };
    ctx.setState(newState);
  }

}

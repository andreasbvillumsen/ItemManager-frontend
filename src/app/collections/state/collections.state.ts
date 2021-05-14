import {CollectionModel} from '../shared/models/CollectionModel';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {CollectionsService} from '../shared/services/collections.service';
import {
  AddCollection, ClearError,
  DeleteCollection, GetAllCollections, GetCollectionsForUser,
  ListenForCollections, ListenForCollectionsForUser, ListenForErrors, StopListening,
  UpdateCollection,
  UpdateCollectionsStore, UpdateError
} from './collections.actions';
import {takeUntil} from 'rxjs/operators';

export interface CollectionsStateModel{
  Collections: CollectionModel[];
  errorMessage: string;
}

@State<CollectionsStateModel>({
  name: 'collection',
  defaults: {
    Collections: [],
    errorMessage: undefined
  }
})
@Injectable()
export class CollectionState {
  unsubscriber$ = new Subject();

  constructor(private collectionsService: CollectionsService) {
  }

  @Selector()
  static Collections(state: CollectionsStateModel): CollectionModel[] {
    return state.Collections;
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

  @Action(DeleteCollection)
  deleteCollection(ctx: StateContext<CollectionsStateModel> , action: DeleteCollection): void {
    this.collectionsService.deleteCollection(action.collectionId, action.Userid);


  }

  @Action(UpdateCollectionsStore)
  updateCollections(ctx: StateContext<CollectionsStateModel>, action: UpdateCollectionsStore): void {
    const state = ctx.getState();
    const newState: CollectionsStateModel = {
      ...state,
      Collections: action.collections
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

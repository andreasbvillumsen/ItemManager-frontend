import {CollectionModel} from '../shared/models/CollectionModel';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {Subscription} from 'rxjs';
import {CollectionsService} from '../shared/services/collections.service';
import {
  AddCollection,
  DeleteCollection, GetCollectionsForUser,
  ListenForCollections, ListenForCollectionsForUser,
  StopListeningForCollections, StopListeningForCollectionsForUser,
  UpdateCollection,
  UpdateCollectionsStore
} from './collections.actions';

export interface CollectionsStateModel{
  Collections: CollectionModel[];
}

@State<CollectionsStateModel>({
  name: 'collection',
  defaults: {
    Collections: []
  }
})
@Injectable()
export class CollectionState {
  initSub: Subscription | undefined;

  constructor(private collectionsService: CollectionsService) {
  }

  @Selector()
  static Collections(state: CollectionsStateModel): CollectionModel[] {
    return state.Collections;
  }

  @Action(ListenForCollections)
  listenForCollections(ctx: StateContext<CollectionsStateModel>): void {
    this.initSub = this.collectionsService.listenForCollections()
      .subscribe(collections => {
        ctx.dispatch(new UpdateCollectionsStore(collections));
      });
  }

  @Action(StopListeningForCollections)
  stopListeningForClients(ctx: StateContext<CollectionsStateModel>): void {
    if (this.initSub) {
      this.initSub.unsubscribe();
    }
  }

  @Action(AddCollection)
  AddCollection(ctx: StateContext<CollectionsStateModel> , action: AddCollection): void {
    this.collectionsService.createCollection(action.collection, action.Userid);


  }

  @Action(UpdateCollection)
  UpdateCollection(ctx: StateContext<CollectionsStateModel> , action: UpdateCollection): void {
    this.collectionsService.updateCollection(action.collection, action.Userid);


  }

  @Action(DeleteCollection)
  DeleteCollection(ctx: StateContext<CollectionsStateModel> , action: DeleteCollection): void {
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

  @Action(ListenForCollectionsForUser)
  ListenForCollectionsForUser(ctx: StateContext<CollectionsStateModel>, action: ListenForCollectionsForUser): void {
    this.initSub = this.collectionsService.listenForAllCollectionsForUser()
        .subscribe(collections => {
          ctx.dispatch(new UpdateCollectionsStore(collections));
        });
  }

  @Action(StopListeningForCollectionsForUser)
  StopListeningForCollectionsForUser(ctx: StateContext<CollectionsStateModel>): void {
    if (this.initSub) {
      this.initSub.unsubscribe();
    }
  }

}

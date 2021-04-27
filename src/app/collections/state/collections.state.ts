import {Collection} from '../shared/models/collection';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {Subscription} from 'rxjs';
import {CollectionsService} from '../shared/services/collections.service';
import {ListenForCollections, StopListeningForCollections, UpdateCollections} from './collections.actions';

export interface CollectionsStateModel{
  Collections: Collection[];
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
  static Collections(state: CollectionsStateModel): Collection[] {
    return state.Collections;
  }

  @Action(ListenForCollections)
  listenForCollections(ctx: StateContext<CollectionsStateModel>): void {
    this.initSub = this.collectionsService.ListenForCollections()
      .subscribe(collections => {
        ctx.dispatch(new UpdateCollections(collections));
      });
  }

  @Action(StopListeningForCollections)
  stopListeningForClients(ctx: StateContext<CollectionsStateModel>): void {
    if (this.initSub) {
      this.initSub.unsubscribe();
    }
  }

  @Action(UpdateCollections)
  updateCollections(ctx: StateContext<CollectionsStateModel>, action: UpdateCollections): void {
    const state = ctx.getState();
    const newState: CollectionsStateModel = {
      ...state,
      Collections: action.collections
    };
    ctx.setState(newState);
  }
}

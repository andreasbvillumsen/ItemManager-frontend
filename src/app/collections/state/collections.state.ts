import {Collection} from '../shared/models/collection';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {Subscription} from 'rxjs';
import {CollectionsService} from '../shared/services/collections.service';
import {AddCollection, ListenForCollections, StopListeningForCollections, UpdateCollections} from './collections.actions';

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
  @Action(AddCollection)
  AddCollection(ctx: StateContext<CollectionsStateModel> , action: AddCollection): void {
    // this.initSub = this.collectionsService.add


}
  /*
  export class AddCollection {
  constructor(public collection: Collection) {}

  static readonly type = '[collection] add collection';

}

export class UpdateCollection {
  constructor(public collection: Collection) {}

  static readonly type = '[collection] Update collection';

}

export class DeleteCollection {
  constructor(public collection: Collection) {}

  static readonly type = '[collection] delete collection';

}
   */

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

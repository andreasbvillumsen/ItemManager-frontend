import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {Subscription} from 'rxjs';
import {Item} from '../shared/models/item.model';
import {ItemsService} from '../shared/services/items.service';
import {
  AddItem,
  DeleteItem, ItemsInCollection,
  ListenForItems,
  StopListeningForItems,
  UpdateItem,
  UpdateItemsStore
} from './items.actions';

export interface ItemsStateModel{
  items: Item[];
}

@State<ItemsStateModel>({
  name: 'item',
  defaults: {
    items: []
  }
})
@Injectable()
export class ItemState {
  initSub: Subscription | undefined;

  constructor(private itemService: ItemsService) {
  }

  @Selector()
  static items(state: ItemsStateModel): Item[] {
    return state.items;
  }

  @Action(ListenForItems)
  listenForItems(ctx: StateContext<ItemsStateModel>): void {
    this.initSub = this.itemService.listenForItems()
      .subscribe(items => {
        ctx.dispatch(new UpdateItemsStore(items));
      });
  }

  @Action(StopListeningForItems)
  stopListeningForItems(ctx: StateContext<ItemsStateModel>): void {
    if (this.initSub) {
      this.initSub.unsubscribe();
    }
  }

  @Action(AddItem)
  AddItem(ctx: StateContext<ItemsStateModel> , action: AddItem): void {
    this.itemService.createItem(action.item);


  }

  @Action(UpdateItem)
  UpdateItem(ctx: StateContext<ItemsStateModel> , action: UpdateItem): void {
    this.itemService.updateItem(action.item);


  }

  @Action(DeleteItem)
  DeleteItem(ctx: StateContext<ItemsStateModel> , action: DeleteItem): void {
    this.itemService.deleteItem(action.item);


  }
  @Action(ItemsInCollection)
  ItemsInCollection(ctx: StateContext<ItemsStateModel> , action: ItemsInCollection): void{
    this.itemService.getItemsInCollection(action.collectionId);
  }

  @Action(UpdateItemsStore)
  updateItemsStore(ctx: StateContext<ItemsStateModel>, action: UpdateItemsStore): void {
    const state = ctx.getState();
    const newState: ItemsStateModel = {
      ...state,
      items: action.items
    };
    ctx.setState(newState);
  }


}

import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {ItemModel} from '../shared/models/ItemModel';
import {ItemsService} from '../shared/services/items.service';
import {
  AddItem,
  DeleteItem, ItemsInCollection, ListenForErrors,
  ListenForItems, StopListening, UpdateError,
  UpdateItem,
  UpdateItemsStore
} from './items.actions';
import {takeUntil} from 'rxjs/operators';
import {UsersStateModel} from '../../users/state/users.state';

export interface ItemsStateModel{
  items: ItemModel[];
  errorMessage: string;
}

@State<ItemsStateModel>({
  name: 'item',
  defaults: {
    items: [],
    errorMessage: undefined
  }
})
@Injectable()
export class ItemState {
  unsubscriber$ = new Subject();

  constructor(private itemService: ItemsService) {
  }

  @Selector()
  static items(state: ItemsStateModel): ItemModel[] {
    return state.items;
  }

  @Selector()
  static error(state: UsersStateModel): string {
    return state.errorMessage;
  }

  @Action(ListenForItems)
  listenForItems(ctx: StateContext<ItemsStateModel>): void {
     this.itemService.listenForItems()
         .pipe(takeUntil(this.unsubscriber$))
      .subscribe(items => {
        ctx.dispatch(new UpdateItemsStore(items));
      });
  }

  @Action(StopListening)
  stopListening(ctx: StateContext<ItemsStateModel>): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
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
    this.itemService.deleteItem(action.itemId);


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

  @Action(ListenForErrors)
  listenForErrors(ctx: StateContext<ItemsStateModel>): void {
    this.itemService.listenForErrors()
        .pipe(
            takeUntil(this.unsubscriber$)
        )
        .subscribe(error => {
          ctx.dispatch(new UpdateError(error));
        });
  }

  @Action(UpdateError)
  updateError(ctx: StateContext<ItemsStateModel>, action: UpdateError): void {
    const state = ctx.getState();
    const newState: ItemsStateModel = {
      ...state,
      errorMessage: action.errorMessage
    };
    ctx.setState(newState);
  }


}

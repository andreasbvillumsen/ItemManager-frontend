import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemsRoutingModule } from './items-routing.module';
import {NgxsModule} from '@ngxs/store';
import {CollectionState} from '../collections/state/collections.state';
import {ItemsShowComponent} from './items-show/items-show.component';
import {ItemState} from './state/items.state';
import {ItemsAddComponent} from './items-add/items-add.component';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    ItemsShowComponent,
    ItemsAddComponent
  ],
  exports: [
    ItemsShowComponent
  ],
    imports: [
        CommonModule,
        ItemsRoutingModule,
        NgxsModule.forFeature([CollectionState, ItemState]),
        ReactiveFormsModule
    ]
})
export class ItemsModule { }

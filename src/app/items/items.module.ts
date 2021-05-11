import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemsRoutingModule } from './items-routing.module';
import { ItemsComponent } from './items.component';
import {NgxsModule} from '@ngxs/store';
import {CollectionState} from '../collections/state/collections.state';


@NgModule({
  declarations: [
    ItemsComponent
  ],
  imports: [
    CommonModule,
    ItemsRoutingModule,
    NgxsModule.forFeature([CollectionState])
  ]
})
export class ItemsModule { }

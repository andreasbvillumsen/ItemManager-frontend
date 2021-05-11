import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollectionsRoutingModule } from './collections-routing.module';
import { CollectionsComponent } from './collections.component';
import {CollectionState} from './state/collections.state';
import {NgxsModule} from '@ngxs/store';



@NgModule({
  declarations: [
    CollectionsComponent
  ],
  imports: [
    CommonModule,
    CollectionsRoutingModule,
    NgxsModule.forFeature([CollectionState])
  ]
})
export class CollectionsModule { }

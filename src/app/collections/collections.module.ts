import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollectionsRoutingModule } from './collections-routing.module';
import { CollectionsComponent } from './collections.component';
import {CollectionState} from './state/collections.state';
import {NgxsModule} from '@ngxs/store';
import {ItemsModule} from '../items/items.module';
import {ItemState} from '../items/state/items.state';
import {ReactiveFormsModule} from '@angular/forms';
import {UploadFormComponent} from './shared/components/upload-form/upload-form.component';
import {UploadDetailsComponent} from './shared/components/upload-details/upload-details.component';
import {UploadListComponent} from './shared/components/upload-list/upload-list.component';

@NgModule({
  declarations: [
    CollectionsComponent,
    UploadFormComponent,
    UploadDetailsComponent,
    UploadListComponent
  ],
  imports: [
    CommonModule,
    CollectionsRoutingModule,
    NgxsModule.forFeature([CollectionState, ItemState]),
    ItemsModule,
    ReactiveFormsModule,
  ]
})
export class CollectionsModule { }

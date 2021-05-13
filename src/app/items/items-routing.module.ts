import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ItemsShowComponent} from './items-show/items-show.component';

const routes: Routes = [{ path: 'show/:id', component: ItemsShowComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemsRoutingModule { }

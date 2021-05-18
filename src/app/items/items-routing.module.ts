import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ItemsShowComponent} from './items-show/items-show.component';
import {ItemsAddComponent} from './items-add/items-add.component';

const routes: Routes = [
  { path: 'show/:id', component: ItemsShowComponent },
  { path: 'add', component: ItemsAddComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemsRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) }, { path: 'collections', loadChildren: () => import('./collections/collections.module').then(m => m.CollectionsModule) }, { path: 'items', loadChildren: () => import('./items/items.module').then(m => m.ItemsModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

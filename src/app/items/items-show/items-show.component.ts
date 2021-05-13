import { Component, OnInit } from '@angular/core';
import {Store} from '@ngxs/store';
import {ItemModel} from '../shared/models/ItemModel';
import {ItemState} from '../state/items.state';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-items-show',
  templateUrl: './items-show.component.html',
  styleUrls: ['./items-show.component.scss']
})
export class ItemsShowComponent implements OnInit {
  item$: Observable<ItemModel>;

  constructor(private store: Store, private route: ActivatedRoute ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.item$ = this.store.selectOnce(ItemState.item(id));

  }

}

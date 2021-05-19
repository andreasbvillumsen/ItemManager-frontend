import {Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {ItemModel} from '../shared/models/ItemModel';
import {ItemState} from '../state/items.state';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import { Output, EventEmitter } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {first, take} from 'rxjs/operators';
import {GetOneCollectionWithRelations, UpdateCollection} from '../../collections/state/collections.actions';
import {UpdateCollectionDto} from '../../collections/shared/dtos/update-collection.dto';
import {UpdateItem} from '../state/items.actions';

@Component({
  selector: 'app-items-show',
  templateUrl: './items-show.component.html',
  styleUrls: ['./items-show.component.scss']
})
export class ItemsShowComponent implements OnInit {
  item$: Observable<ItemModel>;
  @Input() item: ItemModel;
  @Output() backEvent = new EventEmitter<boolean>();
  editItem: boolean;
  submittedEdit: boolean;
  itemEditFG = new FormGroup({
    nameEditFC: new FormControl('', Validators.required),
    descEditFC: new FormControl('', Validators.required)
  });

  constructor(private store: Store, private route: ActivatedRoute ) { }

  ngOnInit(): void {
    this.editItem = false;

    // const id = Number(this.route.snapshot.paramMap.get('id'));
    this.item$ = this.store.selectOnce(ItemState.item(this.item.id));

  }


  get nameEditFC(): AbstractControl{
    return this.itemEditFG.get('nameEditFC');
  }
  get descEditFC(): AbstractControl{
    return this.itemEditFG.get('descEditFC');
  }

  backButton(): void {
    this.backEvent.next(false);
  }

  updateItem(): void{
    this.submittedEdit = true;
    if (this.itemEditFG.valid){
      const newName = this.nameEditFC.value;
      const newDesc = this.descEditFC.value;

      this.store.dispatch(new UpdateItem({id: this.item.id, name: newName, desc: newDesc, collection: this.item.collection}));




      this.submittedEdit = false;
      this.editItem = false;
      this.nameEditFC.reset();
    }
  }


  showDeleteDialog(): void {

  }

  onCancel(): void  {

  }
}

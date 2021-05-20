import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {ItemModel} from '../shared/models/ItemModel';
import {ItemState} from '../state/items.state';
import {Observable, Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import { Output, EventEmitter } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {first, take, takeUntil} from 'rxjs/operators';
import {DeleteItem, ListenForErrors, StopListening, UpdateItem, ClearError} from '../state/items.actions';

@Component({
  selector: 'app-items-show',
  templateUrl: './items-show.component.html',
  styleUrls: ['./items-show.component.scss']
})
export class ItemsShowComponent implements OnInit, OnDestroy {
  @Select(ItemState.error)
  errorMessage$: Observable<string>;
  errorMessage: string | undefined;
  item$: Observable<ItemModel>;
  @Input() item: ItemModel;
  @Output() backEvent = new EventEmitter<boolean>();
  editItem: boolean;
  deleteDialog: boolean;
  submittedEdit: boolean;
  itemEditFG = new FormGroup({
    nameEditFC: new FormControl('', Validators.required),
    descEditFC: new FormControl('', Validators.required)
  });
  unsubscriber$ = new Subject();

  constructor(private store: Store, private route: ActivatedRoute ) { }

  ngOnInit(): void {
    this.editItem = false;

    // const id = Number(this.route.snapshot.paramMap.get('id'));
    this.item$ = this.store.select(ItemState.item(this.item.id));

    this.store.dispatch(new ListenForErrors());
    this.errorMessage$
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe(error => {
        this.errorMessage = error;
      });

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
   console.log('submit');
   this.submittedEdit = true;
   if (this.itemEditFG.valid){
      const newName = this.nameEditFC.value;
      const newDesc = this.descEditFC.value;
      const itemToUpdate = {
        id: this.item.id,
        name: this.item.name,
        desc: this.item.desc,
        imgLink: this.item.imgLink,
        collection: this.item.collection};

      this.store.dispatch(itemToUpdate);




      this.submittedEdit = false;
      this.editItem = false;
      this.nameEditFC.reset();
    }
  }

  deleteItem(): void{
    this.deleteDialog = false;
    const itemToDelte = {
      id: this.item.id,
      name: this.item.name,
      desc: this.item.desc,
      imgLink: this.item.imgLink,
      collection: this.item.collection};
    this.store.dispatch(itemToDelte);
    this.backButton();

  }

  showDeleteDialog(): void {
    this.deleteDialog = true;
  }

  onCancel(): void  {
      this.itemEditFG.reset();
      this.submittedEdit = false;
      this.editItem = false;


  }

  onCancelDelete(): void {
    this.deleteDialog = false;
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

  clearError(): void {
      this.store.dispatch(new ClearError());


  }
}

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {ItemModel} from '../shared/models/ItemModel';
import {ItemState} from '../state/items.state';
import {Observable, Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import { Output, EventEmitter } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {finalize, first, take, takeUntil} from 'rxjs/operators';
import {DeleteItem, ListenForErrors, StopListening, UpdateItem, ClearError, AddItem} from '../state/items.actions';
import {AngularFireStorage} from '@angular/fire/storage';
import {FileUpload} from '../../collections/shared/models/FileUpload';
import {CreateItemDto} from '../shared/dtos/create-item.dto';
import {UpdateItemDto} from '../shared/dtos/update-item.dto';

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
  selectedFiles: File;
  currentFileUpload: FileUpload;
  storageRef = this.storage.ref('/uploads');

  constructor(private store: Store, private route: ActivatedRoute, private storage: AngularFireStorage) { }

  ngOnInit(): void {
    this.editItem = false;

    this.nameEditFC.setValue(this.item.name);
    this.descEditFC.setValue(this.item.desc);

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

  selectFile(event): void {
    this.selectedFiles = event.target.files.item(0);
  }

  updateItem(): void{
   this.submittedEdit = true;

   if (this.itemEditFG.valid){
      if (this.selectedFiles) {
        if (this.item.imgName) {
          this.storageRef.child(this.item.imgName).delete();
        }

        const basePath = '/uploads';
        const file = this.selectedFiles;
        this.selectedFiles = undefined;
        this.currentFileUpload = new FileUpload(file);

        const filePath = `${basePath}/${this.currentFileUpload.file.name}`;
        const storageRef = this.storage.ref(filePath);
        const uploadTask = this.storage.upload(filePath, this.currentFileUpload.file);

        uploadTask.snapshotChanges().pipe(
          finalize(() => {
            storageRef.getDownloadURL().subscribe(downloadURL => {
              const updateItemDto: UpdateItemDto = {
                id: this.item.id,
                name: this.nameEditFC.value,
                desc: this.descEditFC.value,
                imgName: this.currentFileUpload.file.name,
                imgLink: downloadURL,
                collection: this.item.collection
              };

              this.item = updateItemDto;

              console.log(updateItemDto);

              this.store.dispatch(new UpdateItem(updateItemDto));

              this.editItem = false;
              this.nameEditFC.setValue(this.item.name);
              this.descEditFC.setValue(this.item.desc);
            });
          })
        ).subscribe();
      } else {
        const newName = this.nameEditFC.value;
        const newDesc = this.descEditFC.value;
        const updateItemDto: UpdateItemDto = {
          id: this.item.id,
          name: newName,
          desc: newDesc,
          imgName: this.item.imgName,
          imgLink: this.item.imgLink,
          collection: this.item.collection
        };

        this.item = updateItemDto;

        this.store.dispatch(new UpdateItem(updateItemDto));

        this.submittedEdit = false;
        this.editItem = false;
        this.nameEditFC.setValue(this.item.name);
        this.descEditFC.setValue(this.item.desc);
      }
    }
  }

  deleteItem(): void{
    this.storageRef.child(this.item.imgName).delete();

    this.deleteDialog = false;
    const itemToDelete = {
      id: this.item.id,
      name: this.item.name,
      desc: this.item.desc,
      imgName: this.item.imgName,
      imgLink: this.item.imgLink,
      collection: this.item.collection};
    this.store.dispatch(new DeleteItem(itemToDelete));
    this.backButton();

  }

  showDeleteDialog(): void {
    this.deleteDialog = true;
  }

  onCancel(): void  {
      this.nameEditFC.setValue(this.item.name);
      this.descEditFC.setValue(this.item.desc);
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

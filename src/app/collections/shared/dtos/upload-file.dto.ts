import {FileUpload} from '../models/FileUpload';
import {Observable} from 'rxjs';

export interface UploadFileDto {
  percentage: Observable<number>;
  fileUpload: FileUpload;
}

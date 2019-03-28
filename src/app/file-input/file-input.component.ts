import { Component, EventEmitter, OnInit, Input } from '@angular/core';
import { UploadFile, UploadInput, UploadOutput } from 'ng-mdb-pro/pro/file-input';
import { humanizeBytes } from 'ng-mdb-pro/pro/file-input';

import { FileInputService } from '../../shared/services/file-input.service';
import { File } from '../../shared/models/file';


@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss']
})

export class FileInputComponent implements OnInit  {
  allowedTypes: string;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;  
  newFile : File;

  @Input() type: string;
  @Input() subtype: string;
  
  ngOnInit() {
    this.newFile = new File();
  }

  ngAfterContentInit(){
    if(this.type == 'img'){
      this.allowedTypes = ".png, .jpg, .jpeg"
    }
  }
  constructor(private _fileInputService:  FileInputService) {
      this.files = [];
      this.uploadInput = new EventEmitter<UploadInput>();
      this.humanizeBytes = humanizeBytes;
    }

  showFiles() {
      let files = '';
      for (let i = 0; i < this.files.length; i ++) {
        files += this.files[i].name;
         if (!(this.files.length - 1 === i)) {
           files += ',';
        }
      }
      return files;
   }

  onFileChange(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.newFile.data = reader.result.split(',')[1];
        this.newFile.data = "asdasd";
        this.newFile.name = file.name;
        this.newFile.type = file.type;
        this.newFile.subtype = this.subtype;
        };
      };
    }

  startUpload(): void {
    this._fileInputService.saveFile(this.newFile);
    this.files = [];
  }

  cancelUpload(id: string): void {
      this.uploadInput.emit({ type: 'cancel', id: id });
  }

  onUploadOutput(output: UploadOutput | any): void {

      if (output.type === 'allAddedToQueue') {
      } else if (output.type === 'addedToQueue') {
        this.files.push(output.file); // add file to array when added
      } else if (output.type === 'uploading') {
        // update current data in files array for uploading file
        const index = this.files.findIndex(file => file.id === output.file.id);
        this.files[index] = output.file;
      } else if (output.type === 'removed') {
        // remove file from array when removed
        this.files = this.files.filter((file: UploadFile) => file !== output.file);
      } else if (output.type === 'dragOver') {
        this.dragOver = true;
      } else if (output.type === 'dragOut') {
      } else if (output.type === 'drop') {
        this.dragOver = false;
      }
      this.showFiles();
  }
}
import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { UploadFile, UploadInput, UploadOutput } from 'ng-uikit-pro-standard';
import { humanizeBytes } from 'ng-uikit-pro-standard';

import { FileInputService } from '../../shared/services/file-input.service';
import { File } from '../../shared/models/file';


@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss']
})

export class FileInputComponent implements OnInit {
  allowedTypes: string;
  formData: FormData;
  files: UploadFile[];
  errorMessage: string;
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  newFile: File;

  @Input() type: string;
  @Input() subtype: string;
  @Output() validator = new EventEmitter<Array<string>>();

  ngOnInit() {
    this.newFile = new File();
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  ngAfterContentInit() {
    if (this.type == 'img') {
      this.allowedTypes = ".png, .jpg, .jpeg"
    }
  }
  constructor(private _fileInputService: FileInputService) {
  }

  showFiles() {
    let files = '';
    for (let i = 0; i < this.files.length; i++) {
      files += this.files[i].name;
      if (!(this.files.length - 1 === i)) {
        files += ',';
      }
    }
    return files;
  }

  toBase64(file){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  async onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      let base64File = await this.toBase64(file);
      this.validator.emit([file.name, base64File]);
    }
  };

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
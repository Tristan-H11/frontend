import { Component, ElementRef, OnInit, Type, ViewChild } from '@angular/core';
import { WindowComponent, WindowConstraints, WindowDelegate } from '../../window/window-delegate';
import { FileService } from '../../../api/files/file.service';
import { Path } from '../../../api/files/path';
import { File } from '../../../api/files/file';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent extends WindowComponent implements OnInit {

  @ViewChild('fileInput', { static: true }) fileInput: ElementRef;

  delegate: EditorWindowDelegate;

  error: string;
  fileContent: string;
  fileOpened: boolean;

  constructor(private fileService: FileService) {
    super();
  }

  ngOnInit() {
    this.fileOpened = false;

    if (this.delegate.openFile != null && !this.delegate.openFile.is_directory) {
      this.fileOpened = true;
      this.fileContent = this.delegate.openFile.content;
      this.fileService.getAbsolutePath(this.delegate.device.uuid, this.delegate.openFile.uuid).subscribe(path => {
        this.fileInput.nativeElement.value = '/' + path.join('/');
      });
      this.fileInput.nativeElement.disabled = true;
    }
  }

  enter(inputPath: string) {
    let path: Path;
    try {
      path = Path.fromString(inputPath, Path.ROOT);
    } catch {
      this.error = 'Path not valid';
      return;
    }

    this.fileService.getFromPath(this.delegate.device.uuid, path).subscribe(file => {
      if (file.is_directory) {
        this.error = 'Not a file';
      } else {
        this.error = '';
        this.fileOpened = true;
        this.fileContent = file.content;
      }
    }, error => {
      if (error.message === 'file_not_found') {
        this.error = 'File was not found';
      } else {
        this.error = error.toString();
      }
    });
  }
}

export class EditorWindowDelegate extends WindowDelegate {
  title = 'Editor';
  icon = 'assets/desktop/img/editor.svg';
  type: Type<any> = EditorComponent;

  constraints = new WindowConstraints({ minWidth: 300, minHeight: 200 });

  constructor(public openFile?: File) {
    super();
  }
}

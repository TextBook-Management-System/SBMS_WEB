import { Component, Input, Output, EventEmitter, NgZone, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  standalone: false,
  templateUrl: './file-upload.html',
  styleUrls: ['./file-upload.css']
})
export class FileUploadComponent {
  @Input() label = 'Upload Image';
  @Input() accept = 'image/jpeg,image/png';
  @Input() maxSizeMb = 10;
  @Output() fileSelected = new EventEmitter<File>();

  fileName: string | null = null;
  previewUrl: string | null = null;
  error: string | null = null;

  constructor(
    private readonly zone: NgZone,
    private readonly cdr: ChangeDetectorRef
  ) {}

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // Validate size
    if (file.size > this.maxSizeMb * 1024 * 1024) {
      this.error = `File must be less than ${this.maxSizeMb}MB`;
      this.cdr.detectChanges();
      return;
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
      this.error = 'Only image files are allowed';
      this.cdr.detectChanges();
      return;
    }

    this.error = null;
    this.fileName = file.name;

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      this.zone.run(() => {
        this.previewUrl = reader.result as string;
        this.cdr.detectChanges();
      });
    };
    reader.readAsDataURL(file);

    this.fileSelected.emit(file);
  }

  clear(): void {
    this.fileName = null;
    this.previewUrl = null;
    this.error = null;
  }
}

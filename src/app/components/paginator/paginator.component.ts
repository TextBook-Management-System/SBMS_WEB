import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: false,
  template: `
    <div class="paginator" *ngIf="totalItems > pageSize">
      <div class="paginator-info">
        Showing {{ startItem }}–{{ endItem }} of {{ totalItems }}
      </div>
      <div class="paginator-controls">
        <button
          class="page-btn"
          [disabled]="currentPage === 1"
          (click)="goToPage(1)"
          title="First page">
          <i class="pi pi-angle-double-left"></i>
        </button>
        <button
          class="page-btn"
          [disabled]="currentPage === 1"
          (click)="goToPage(currentPage - 1)"
          title="Previous page">
          <i class="pi pi-angle-left"></i>
        </button>

        <button
          *ngFor="let page of visiblePages"
          class="page-btn"
          [class.active]="page === currentPage"
          (click)="goToPage(page)">
          {{ page }}
        </button>

        <button
          class="page-btn"
          [disabled]="currentPage === totalPages"
          (click)="goToPage(currentPage + 1)"
          title="Next page">
          <i class="pi pi-angle-right"></i>
        </button>
        <button
          class="page-btn"
          [disabled]="currentPage === totalPages"
          (click)="goToPage(totalPages)"
          title="Last page">
          <i class="pi pi-angle-double-right"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    @reference "tailwindcss";

    .paginator {
      @apply flex items-center justify-between px-4 py-3 border-t border-gray-100;
    }

    .paginator-info {
      @apply text-xs text-gray-500;
    }

    .paginator-controls {
      @apply flex items-center gap-1;
    }

    .page-btn {
      @apply w-8 h-8 rounded-md flex items-center justify-center text-sm text-gray-600
             hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed;
    }

    .page-btn.active {
      @apply text-white font-medium;
      background-color: var(--color-primary, #16a34a);
    }

    .page-btn.active:hover {
      background-color: var(--color-primary-shade, #138f41);
    }

    .page-btn i {
      @apply text-xs;
    }

    @media (max-width: 767px) {
      .paginator { @apply flex-col gap-2 items-center; }
      .paginator-info { @apply text-xs; }
    }
  `]
})
export class PaginatorComponent {
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() currentPage = 1;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get startItem(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(this.totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.pageChange.emit(page);
    }
  }
}

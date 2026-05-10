import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryService, SchoolInventory } from '../../../services/inventory';

@Component({
  selector: 'app-inventory-list',
  standalone: false,
  templateUrl: './inventory-list.html',
  styleUrls: ['./inventory-list.css']
})
export class InventoryListComponent implements OnInit {
  inventory: SchoolInventory[] = [];
  paginatedInventory: SchoolInventory[] = [];
  totals: SchoolInventory | undefined;
  isLoading = true;
  currentPage = 1;
  pageSize = 10;

  constructor(
    private readonly inventoryService: InventoryService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
    this.isLoading = true;
    this.inventoryService.getAll().subscribe(inventory => {
      this.inventory = inventory;
      this.updatePagination();
      this.isLoading = false;
    });
    this.inventoryService.getTotals().subscribe(totals => {
      this.totals = totals;
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  private updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedInventory = this.inventory.slice(start, start + this.pageSize);
  }

  printInventory(): void {
    this.router.navigate(['/app/inventory/print']);
  }
}

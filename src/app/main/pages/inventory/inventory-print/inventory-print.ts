import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryService, SchoolInventory } from '../../../services/inventory';

@Component({
  selector: 'app-inventory-print',
  standalone: false,
  templateUrl: './inventory-print.html',
  styleUrls: ['./inventory-print.css']
})
export class InventoryPrintComponent implements OnInit {
  inventory: SchoolInventory[] = [];
  totals: SchoolInventory | undefined;
  printDate = new Date();

  constructor(
    private readonly inventoryService: InventoryService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.inventoryService.getAll().subscribe(inventory => {
      this.inventory = inventory;
    });
    this.inventoryService.getTotals().subscribe(totals => {
      this.totals = totals;
    });
  }

  print(): void {
    window.print();
  }

  goBack(): void {
    this.router.navigate(['/app/inventory']);
  }
}

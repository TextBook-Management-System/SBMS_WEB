import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BookPackage, BookPackageItem, BookPackageStatus, BookCondition, BookPackageHistory, QRCodeData } from '../models/book-package.model';

@Injectable({
  providedIn: 'root'
})
export class BookPackageService {
  
  private mockPackages: BookPackage[] = [
    {
      id: 'pkg-001',
      packageNumber: 'PKG-2026-001',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      originSchoolId: 's1',
      originSchoolName: 'Central High School',
      destinationSchoolId: 's2',
      destinationSchoolName: 'East Valley Middle School',
      status: BookPackageStatus.SHIPPED,
      createdBy: 'admin1',
      createdAt: new Date(2026, 4, 1),
      shippedAt: new Date(2026, 4, 3),
      totalBooks: 15,
      notes: 'First batch of science books',
      items: [
        { id: 'item-1', packageId: 'pkg-001', bookId: 'b1', isbn: '978-0-123456-78-9', title: 'Biology 101', author: 'Dr. Smith', quantity: 5, condition: BookCondition.EXCELLENT, addedAt: new Date(2026, 4, 1), addedBy: 'admin1' },
        { id: 'item-2', packageId: 'pkg-001', bookId: 'b2', isbn: '978-0-987654-32-1', title: 'Chemistry Basics', author: 'Prof. Johnson', quantity: 10, condition: BookCondition.GOOD, addedAt: new Date(2026, 4, 1), addedBy: 'admin1' }
      ]
    },
    {
      id: 'pkg-002',
      packageNumber: 'PKG-2026-002',
      originSchoolId: 's1',
      originSchoolName: 'Central High School',
      destinationSchoolId: 's3',
      destinationSchoolName: 'North Park Elementary',
      status: BookPackageStatus.PACKAGING,
      createdBy: 'admin1',
      createdAt: new Date(2026, 4, 5),
      totalBooks: 8,
      notes: 'Math and English books',
      items: [
        { id: 'item-3', packageId: 'pkg-002', bookId: 'b3', isbn: '978-0-555555-55-5', title: 'Mathematics Grade 8', author: 'Dr. Williams', quantity: 8, condition: BookCondition.FAIR, addedAt: new Date(2026, 4, 5), addedBy: 'admin1' }
      ]
    },
    {
      id: 'pkg-003',
      packageNumber: 'PKG-2026-003',
      originSchoolId: 's2',
      originSchoolName: 'East Valley Middle School',
      destinationSchoolId: 's1',
      destinationSchoolName: 'Central High School',
      status: BookPackageStatus.RECEIVED,
      createdBy: 'admin2',
      createdAt: new Date(2026, 3, 15),
      shippedAt: new Date(2026, 3, 18),
      receivedAt: new Date(2026, 3, 22),
      totalBooks: 12,
      notes: 'Return shipment',
      items: [
        { id: 'item-4', packageId: 'pkg-003', bookId: 'b4', isbn: '978-0-444444-44-4', title: 'History & Culture', author: 'Dr. Brown', quantity: 12, condition: BookCondition.GOOD, addedAt: new Date(2026, 3, 15), addedBy: 'admin2' }
      ]
    },
    {
      id: 'pkg-004',
      packageNumber: 'PKG-2026-004',
      originSchoolId: 's1',
      originSchoolName: 'Central High School',
      destinationSchoolId: 's4',
      destinationSchoolName: 'South Ridge High',
      status: BookPackageStatus.DECLINED,
      createdBy: 'admin1',
      createdAt: new Date(2026, 3, 25),
      shippedAt: new Date(2026, 3, 27),
      declinedAt: new Date(2026, 3, 28),
      declineReason: 'Warehouse at capacity - cannot receive new shipments at this time',
      totalBooks: 20,
      items: []
    }
  ];

  private mockHistory: BookPackageHistory[] = [
    { id: 'h1', packageId: 'pkg-001', action: 'created', details: 'Package created for shipment', performedBy: 'admin1', performedAt: new Date(2026, 4, 1) },
    { id: 'h2', packageId: 'pkg-001', action: 'item_added', details: 'Added 5 units of Biology 101', performedBy: 'admin1', performedAt: new Date(2026, 4, 1) },
    { id: 'h3', packageId: 'pkg-001', action: 'item_added', details: 'Added 10 units of Chemistry Basics', performedBy: 'admin1', performedAt: new Date(2026, 4, 1) },
    { id: 'h4', packageId: 'pkg-001', action: 'qr_generated', details: 'QR code generated and printed', performedBy: 'admin1', performedAt: new Date(2026, 4, 2) },
    { id: 'h5', packageId: 'pkg-001', action: 'shipped', details: 'Package shipped via courier', performedBy: 'admin1', performedAt: new Date(2026, 4, 3) }
  ];

  constructor() { }

  getAllPackages(): Observable<BookPackage[]> {
    return of(this.mockPackages);
  }

  getPackageById(id: string): Observable<BookPackage | undefined> {
    const pkg = this.mockPackages.find(p => p.id === id);
    if (pkg) {
      pkg.history = this.mockHistory.filter(h => h.packageId === id);
    }
    return of(pkg);
  }

  getOutgoingPackages(originSchoolId: string): Observable<BookPackage[]> {
    return of(this.mockPackages.filter(p => p.originSchoolId === originSchoolId));
  }

  getIncomingPackages(destinationSchoolId: string): Observable<BookPackage[]> {
    return of(this.mockPackages.filter(p => p.destinationSchoolId === destinationSchoolId));
  }

  getPackagesByStatus(status: BookPackageStatus): Observable<BookPackage[]> {
    return of(this.mockPackages.filter(p => p.status === status));
  }

  createPackage(destinationSchoolId: string, destinationSchoolName: string, notes?: string): Observable<BookPackage> {
    const newPackage: BookPackage = {
      id: `pkg-${this.mockPackages.length + 1}`,
      packageNumber: `PKG-2026-${String(this.mockPackages.length + 1).padStart(3, '0')}`,
      originSchoolId: 's1',
      originSchoolName: 'Central High School',
      destinationSchoolId,
      destinationSchoolName,
      status: BookPackageStatus.PACKAGING,
      createdBy: 'admin1',
      createdAt: new Date(),
      totalBooks: 0,
      notes,
      items: []
    };
    this.mockPackages.push(newPackage);
    return of(newPackage);
  }

  addItemToPackage(packageId: string, item: Partial<BookPackageItem>): Observable<BookPackage | undefined> {
    const pkg = this.mockPackages.find(p => p.id === packageId);
    if (pkg) {
      const newItem: BookPackageItem = {
        id: `item-${Date.now()}`,
        packageId,
        bookId: item.bookId || '',
        isbn: item.isbn || '',
        title: item.title,
        author: item.author,
        quantity: item.quantity || 1,
        condition: item.condition || BookCondition.GOOD,
        addedAt: new Date(),
        addedBy: 'admin1'
      };
      if (!pkg.items) {
        pkg.items = [];
      }
      pkg.items.push(newItem);
      pkg.totalBooks += newItem.quantity;
    }
    return of(pkg);
  }

  removeItemFromPackage(packageId: string, itemId: string): Observable<BookPackage | undefined> {
    const pkg = this.mockPackages.find(p => p.id === packageId);
    if (pkg && pkg.items) {
      const item = pkg.items.find(i => i.id === itemId);
      if (item) {
        pkg.totalBooks -= item.quantity;
        pkg.items = pkg.items.filter(i => i.id !== itemId);
      }
    }
    return of(pkg);
  }

  generateQRCode(packageId: string): Observable<{ qrCode: string; packageNumber: string }> {
    const pkg = this.mockPackages.find(p => p.id === packageId);
    if (pkg) {
      // Simple base64 QR code simulation
      const qrData: QRCodeData = {
        packageId,
        packageNumber: pkg.packageNumber,
        originSchoolId: pkg.originSchoolId,
        destinationSchoolId: pkg.destinationSchoolId,
        timestamp: new Date().toISOString()
      };
      pkg.qrCode = 'data:image/svg+xml;base64,' + btoa(`<svg width="200" height="200"><text x="10" y="20">${pkg.packageNumber}</text><text x="10" y="40">${pkg.destinationSchoolName}</text></svg>`);
      return of({ qrCode: pkg.qrCode, packageNumber: pkg.packageNumber });
    }
    return of({ qrCode: '', packageNumber: '' });
  }

  markAsReadyToShip(packageId: string): Observable<BookPackage | undefined> {
    const pkg = this.mockPackages.find(p => p.id === packageId);
    if (pkg) {
      pkg.status = BookPackageStatus.READY_TO_SHIP;
    }
    return of(pkg);
  }

  markAsShipped(packageId: string): Observable<BookPackage | undefined> {
    const pkg = this.mockPackages.find(p => p.id === packageId);
    if (pkg) {
      pkg.status = BookPackageStatus.SHIPPED;
      pkg.shippedAt = new Date();
    }
    return of(pkg);
  }

  acceptPackage(packageId: string, notes?: string): Observable<BookPackage | undefined> {
    const pkg = this.mockPackages.find(p => p.id === packageId);
    if (pkg) {
      pkg.status = BookPackageStatus.RECEIVED;
      pkg.receivedAt = new Date();
      if (notes) {
        pkg.notes = (pkg.notes || '') + ' [ACCEPTED: ' + notes + ']';
      }
    }
    return of(pkg);
  }

  declinePackage(packageId: string, reason: string): Observable<BookPackage | undefined> {
    const pkg = this.mockPackages.find(p => p.id === packageId);
    if (pkg) {
      pkg.status = BookPackageStatus.DECLINED;
      pkg.declinedAt = new Date();
      pkg.declineReason = reason;
    }
    return of(pkg);
  }

  scanQRCode(qrCode: string): Observable<BookPackage | undefined> {
    // In real app, this would parse the QR code and find the package
    const pkg = this.mockPackages.find(p => p.qrCode === qrCode);
    return of(pkg);
  }

  getPackageHistory(packageId: string): Observable<BookPackageHistory[]> {
    return of(this.mockHistory.filter(h => h.packageId === packageId));
  }
}

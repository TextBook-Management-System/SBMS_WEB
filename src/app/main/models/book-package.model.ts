export enum BookPackageStatus {
  PACKAGING = 'packaging',
  READY_TO_SHIP = 'ready_to_ship',
  SHIPPED = 'shipped',
  IN_TRANSIT = 'in_transit',
  RECEIVED = 'received',
  DECLINED = 'declined'
}

export enum BookCondition {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor'
}

export interface BookPackageItem {
  id: string;
  packageId: string;
  bookId: string;
  isbn: string;
  barcode?: string;
  title?: string;
  author?: string;
  quantity: number;
  condition: BookCondition;
  addedAt: Date;
  addedBy?: string;
}

export interface BookPackageHistory {
  id: string;
  packageId: string;
  action: string;
  details: string;
  performedBy: string;
  performedAt: Date;
}

export interface BookPackage {
  id: string;
  packageNumber: string;
  qrCode?: string;
  originSchoolId: string;
  originSchoolName?: string;
  destinationSchoolId: string;
  destinationSchoolName?: string;
  status: BookPackageStatus;
  createdBy: string;
  createdAt: Date;
  shippedAt?: Date;
  receivedAt?: Date;
  declinedAt?: Date;
  declineReason?: string;
  totalBooks: number;
  notes?: string;
  items?: BookPackageItem[];
  history?: BookPackageHistory[];
}

export interface QRCodeData {
  packageId: string;
  packageNumber: string;
  originSchoolId: string;
  destinationSchoolId: string;
  timestamp: string;
}

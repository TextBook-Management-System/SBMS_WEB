export interface Parent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idNumber: string;
  address: string;
  learnerIds: string[];
  userId?: string; // linked auth user account
  createdAt: Date;
  updatedAt: Date;
}

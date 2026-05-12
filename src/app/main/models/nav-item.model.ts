import { UserRole } from './role.enum';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles: UserRole[];
  children?: NavItem[];
  badge?: string;
}

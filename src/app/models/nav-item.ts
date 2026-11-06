export interface NavItem {
  label: string;
  path?: string;
  action?: 'logout';
  requredAuth?: boolean;
  requiresRole: 'Admin' | 'User';
}

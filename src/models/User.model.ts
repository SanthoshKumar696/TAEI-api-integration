export interface Permission {
  page: string;
  access: 'read' | 'write';
}

export interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  directorate: string;
  institution_id: number;
  permissions: Permission[];
  iat: number;
  exp: number;
}
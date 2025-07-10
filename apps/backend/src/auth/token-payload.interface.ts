import { Role } from '@prisma/client';

export interface TokenPayload {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  role: Role;
  emailVerified: boolean;
}

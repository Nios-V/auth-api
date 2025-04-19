export class User {
  id: number;
  name: string;
  active: boolean;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

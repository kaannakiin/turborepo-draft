import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly database: DatabaseService) {}

  async getUserUnique({
    where,
    select,
  }: {
    where: Prisma.UserWhereUniqueInput;
    select?: Prisma.UserSelect;
  }) {
    return this.database.user.findUnique({
      where,
      ...(select ? { select } : {}),
    });
  }
  async createUser({ create }: { create: Prisma.UserCreateInput }) {
    return this.database.user.create({
      data: create,
    });
  }
  async updateUser({
    data,
    where,
  }: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }) {
    return this.database.user.update({
      where,
      data,
    });
  }
}

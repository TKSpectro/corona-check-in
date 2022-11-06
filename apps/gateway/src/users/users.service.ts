import { Injectable } from '@nestjs/common';

export type User = {
  id: string;
  email: string;
  password: string;
  roles: Role[];
};

export enum Role {
  Admin = 'admin',
  User = 'user',
}

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
      email: 'admin@turbomeet.xyz',
      // password: hashSync('password', 10),
      password: '$2b$10$.u8J.QB3BqWG7/9e4Q.hpOoEubTbsNqHPc.sQLY2bdrisDduk8wFS',
      roles: [Role.Admin],
    },
    {
      id: 'b1c2d3e4-f5g6-h7i8-j9k0-l1m2n3o4p5q6',
      email: 'user@turbomeet.xyz',
      // password: hashSync('password', 10),
      password: '$2b$10$.u8J.QB3BqWG7/9e4Q.hpOoEubTbsNqHPc.sQLY2bdrisDduk8wFS',
      roles: [Role.User],
    },
  ];

  async findOne(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcrypt';
import { UserEntity } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<UserEntity | null> {
    const user = await this.usersService.findOne(email);

    if (user && compareSync(pass, user.password)) {
      delete user.password;
      return user;
    }

    return null;
  }

  async login(user: UserEntity) {
    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  // TODO: Setup better schema validation
  async signup(userInput: UserEntity) {
    delete userInput.id;
    delete userInput.role;

    userInput.password = hashSync(userInput.password, 10);

    const user = await this.usersService.create(userInput);

    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async me(reqUser: { email: string; sub: string; roles: string }) {
    return await this.usersService.findOne(reqUser.email);
  }
}

import { UserEntity } from '@corona-check-in/micro-service-shared';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignupUserDto } from './auth.dto';

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

  async signup(userInput: SignupUserDto) {
    if (userInput.password !== userInput.passwordRepeat) {
      throw new HttpException(
        'ERROR_PASSWORDS_NOT_MATCHING',
        HttpStatus.BAD_REQUEST
      );
    }

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

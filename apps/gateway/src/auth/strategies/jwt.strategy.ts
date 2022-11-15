import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { environment } from '../../environments/environment';
import { UserRole } from '../../users/user.entity';

export interface JwtPayload {
  email: string;
  sub: string;
  roles: UserRole[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: environment.auth.jwt.secret,
    });
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}

import { UserRole } from '@corona-check-in/micro-service-shared';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { environment } from '../../environments/environment';

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

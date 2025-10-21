import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(private readonly reflector: Reflector){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string [] = this.reflector.get('roles', context.getHandler())
    if(!validRoles || validRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    if(!user) throw new BadRequestException('User not exist');
    const hasValidRole= user.roles.some(role => validRoles.includes(role));
    if(!hasValidRole){
      throw new UnauthorizedException(`User ${user.fullName} does not have a valid role: [${validRoles}]`)
    }

    return true;
  }
}
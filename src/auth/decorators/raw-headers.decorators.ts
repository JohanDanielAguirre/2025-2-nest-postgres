import{ExecutionContext} from '@nestjs/common';
import * as request from 'supertest';

export const RawHeaders = (context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest();
  return req.rawHeaders;
}
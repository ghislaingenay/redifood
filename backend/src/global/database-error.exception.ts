import { HttpException, HttpStatus } from '@nestjs/common';

export class DatabaseError extends HttpException {
  constructor() {
    super('Database connection error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

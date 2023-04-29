import { Injectable } from '@nestjs/common';
import { User } from 'src/app.interface';

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: '1',
      username: 'Peter',
      name: 'Pita Kale',
      password: 'aae',
    },
    {
      userId: '2',
      username: 'Kol',
      name: 'Anton Magl',
      password: 'guessplz',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}

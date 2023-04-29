import { Injectable } from '@nestjs/common';
import { AuthDto } from 'src/app.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  login(dto: AuthDto) {
    console.log(dto);
    // find the user by email
    // if user does not exist, throw excetpt
    return { msg: 'LoggedIn' };
  }

  signup(dto: AuthDto) {
    console.log(dto);
    // find the user by email
    // if user does not exist throw exception
    // Compare password
    // if password incorrect => throw exception
    // Otherwise, send data
    // if (!user) throw new ForbiddenExeption ('Credentials incorrect')
    // if (wrons password) throw new ForbiddenExeption ('Credentials incorrect')
    // delete user.hash
    return { msg: 'I am signed up' };
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}

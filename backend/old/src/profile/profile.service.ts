import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfileService {
  getProfileData() {
    return {
      username: 'peter',
      password: 'kkk',
    };
  }

  UpdateInformations() {
    return true;
  }
}

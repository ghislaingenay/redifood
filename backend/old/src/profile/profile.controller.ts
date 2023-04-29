import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AuthGuard('local'))
  @Get()
  // Get info from DB - any type because I don't know what will be implemented in profile page
  getProfileData(): any {
    return this.profileService.getProfileData();
  }

  @UseGuards(AuthGuard('local'))
  @Patch()
  // Patch info into DB - any type because I don't know what will be implemented in profile page
  updateInformations(): any {
    return this.profileService.UpdateInformations();
  }
}

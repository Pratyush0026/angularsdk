import { Injectable } from '@angular/core';
import { TrackScreenService } from './track-screen.service';

// import { TrackUserService } from './track-user.service';
import { TrackUserActionService } from './track-user-action.service';
import { VerifyAccountService } from './verify-account.service';
import { VerifyUserService } from './verify-user.service';
import { UserData } from './user-data.type';

@Injectable({
  providedIn: 'root',
})
export class AppStorysService {
  private static instance: AppStorysService;
  private campaigns: any[] = [];

  constructor(
    private trackScreenService: TrackScreenService,
    // private trackUserService: TrackUserService,
    private trackUserActionService: TrackUserActionService,
    private verifyAccountService: VerifyAccountService,
    private verifyUserService: VerifyUserService
  ) {
    if (!AppStorysService.instance) {
      AppStorysService.instance = this;
    }
    return AppStorysService.instance;
  }

  async trackScreen(appId: string, screenName: string): Promise<any[]> {
    this.campaigns = await this.trackScreenService.trackScreen(appId, screenName);
    return this.campaigns;
  }

  // async trackUser(userId: string, attributes?: any): Promise<void> {
  //   return this.trackUserService.trackUser(userId, attributes);
  // }

  async trackUserAction(userId: string, campaignId: string, action: any): Promise<void> {
    return this.trackUserActionService.trackUserAction(userId, campaignId, action);
  }

  async verifyAccount(accountId: string, appId: string): Promise<void> {
    return this.verifyAccountService.verifyAccount(accountId, appId);
  }

  async verifyUser(userId: string, campaigns: any[], attributes?: any): Promise<UserData | undefined> {
  return this.verifyUserService.verifyUser(userId, campaigns, attributes);
}


  getCampaigns(): any[] {
    return this.campaigns;
  }
}

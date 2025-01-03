import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TrackScreenService } from './track-screen.service';
import { TrackUserActionService } from './track-user-action.service';
import { VerifyAccountService } from './verify-account.service';
import { VerifyUserService } from './verify-user.service';
import { UserData } from './user-data.type';
import { UserAttributes } from '../interfaces/user.interface';
import { ActionType } from '../types/action.types';

@Injectable({
  providedIn: 'root'
})
export class AppStorysService {
  private campaigns: any[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private trackScreenService: TrackScreenService,
    private trackUserActionService: TrackUserActionService,
    private verifyAccountService: VerifyAccountService,
    private verifyUserService: VerifyUserService
  ) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  async trackScreen(appId: string, screenName: string): Promise<any[]> {
    if (!this.isBrowser()) return [];
    
    this.campaigns = await this.trackScreenService.trackScreen(appId, screenName);
    return this.campaigns;
  }

  async trackUserAction(userId: string, campaignId: string, action: ActionType): Promise<void> {
    if (!this.isBrowser()) return;
    
    return this.trackUserActionService.trackUserAction(userId, campaignId, action);
  }

  async verifyAccount(accountId: string, appId: string): Promise<void> {
    if (!this.isBrowser()) return;
    
    return this.verifyAccountService.verifyAccount(accountId, appId);
  }

  async verifyUser(userId: string, campaigns: any[], attributes?: UserAttributes): Promise<UserData | undefined> {
    if (!this.isBrowser()) return undefined;
    
    return this.verifyUserService.verifyUser(userId, campaigns, attributes);
  }

  getCampaigns(): any[] {
    return this.campaigns;
  }
}
import { Injectable } from '@angular/core';
import { TrackScreenService } from './track-screen.service';
import { TrackUserActionService } from './track-user-action.service';
import { VerifyAccountService } from './verify-account.service';
import { VerifyUserService } from './verify-user.service';
import { StorageService } from './storage.service';
import { ActionType } from '../types/action.types';

@Injectable({
  providedIn: 'root'
})
export class AppStorysService {
  constructor(
    private trackScreenService: TrackScreenService,
    private trackUserActionService: TrackUserActionService,
    private verifyAccountService: VerifyAccountService,
    private verifyUserService: VerifyUserService,
    private storageService: StorageService
  ) {}

  async getAccessToken(): Promise<string | null> {
    return this.storageService.getItem('access_token');
  }

  async trackScreen(appId: string, screenName: string): Promise<any> {
    return this.trackScreenService.trackScreen(appId, screenName);
  }

  async trackUserAction(userId: string, campaignId: string, action: ActionType): Promise<void> {
    return this.trackUserActionService.trackUserAction(userId, campaignId, action);
  }

  async verifyAccount(accountId: string, appId: string): Promise<void> {
    return this.verifyAccountService.verifyAccount(accountId, appId);
  }

  async verifyUser(userId: string, campaigns: any): Promise<any> {
    return this.verifyUserService.verifyUser(userId, campaigns);
  }
}
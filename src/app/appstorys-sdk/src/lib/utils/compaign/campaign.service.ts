import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';
import { AppStorysService } from '../app-storys.service';
import { CampaignData } from '../../interfaces/compaign';

interface CampaignState {
  loading: boolean;
  error: string | null;
  data: CampaignData;
  initialized: boolean;
}

const initialState: CampaignState = {
  loading: false,
  error: null,
  data: {
    campaigns: [],
    access_token: '',
    user_id: ''
  },
  initialized: false
};

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private readonly state = new BehaviorSubject<CampaignState>(initialState);

  readonly loading$ = this.state.pipe(
    map(state => state.loading),
    distinctUntilChanged()
  );

  readonly error$ = this.state.pipe(
    map(state => state.initialized ? state.error : null),
    distinctUntilChanged()
  );

  readonly campaignData$ = this.state.pipe(
    map(state => state.data),
    distinctUntilChanged()
  );

  constructor(private readonly appStorysService: AppStorysService) {}

  async initializeCampaigns(
    accountId: string, 
    appId: string, 
    userId: string, 
    screenName: string
  ): Promise<void> {
    if (this.state.value.loading) return;

    this.state.next({
      ...this.state.value,
      loading: true,
      error: null,
      initialized: true
    });

    try {
      // First verify account and get tokens
      await this.appStorysService.verifyAccount(accountId, appId);
      
      // Get access token
      const accessToken = await this.appStorysService.getAccessToken();
      if (!accessToken) {
        throw new Error('Access token not found');
      }

      // Get screen campaigns
      const screenData = await this.appStorysService.trackScreen(appId, screenName);
      
      if (!screenData?.campaigns) {
        throw new Error('No campaigns available');
      }

      // Verify user and get campaign details
      const userData = await this.appStorysService.verifyUser(userId, screenData);
      
      if (!userData) {
        throw new Error('Failed to get user campaign data');
      }

      // Create campaign data with user-specific campaign details
      const campaignData: CampaignData = {
        campaigns: userData.campaigns,
        access_token: accessToken,
        user_id: userId
      };

      this.state.next({
        loading: false,
        error: null,
        data: campaignData,
        initialized: true
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      this.state.next({
        ...this.state.value,
        loading: false,
        error: errorMessage,
        initialized: true
      });
      console.error('Error initializing campaigns:', error);
    }
  }
}
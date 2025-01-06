import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';
import { CampaignData } from '../../interfaces/compaign';
import { AppStorysService } from '../app-storys.service';


interface CampaignState {
  loading: boolean;
  error: string | null;
  data: CampaignData | null;
  initialized: boolean;
}

const initialState: CampaignState = {
  loading: false,
  error: null,
  data: null,
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
      await this.appStorysService.verifyAccount(accountId, appId);
      const campaigns = await this.appStorysService.trackScreen(appId, screenName);
      
      if (!campaigns?.campaigns?.length) {
        throw new Error('No campaigns available');
      }

      const accessToken = await this.appStorysService.getAccessToken();
      if (!accessToken) {
        throw new Error('Access token not found');
      }

      const campaignData: CampaignData = {
        campaigns: campaigns.campaigns,
        access_token: accessToken,
        user_id: userId
      };

      const verifiedUser = await this.appStorysService.verifyUser(userId, campaigns);
      if (verifiedUser?.campaigns) {
        campaignData.campaigns = verifiedUser.campaigns;
      }

      this.state.next({
        loading: false,
        error: null,
        data: campaignData,
        initialized: true
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      this.state.next({
        loading: false,
        error: errorMessage,
        data: null,
        initialized: true
      });
      console.error('Error initializing campaigns:', error);
    }
  }

  getCampaigns(): Observable<CampaignData> {
    return this.campaignData$.pipe(
      map(data => data || { campaigns: [], access_token: '', user_id: '' })
    );
  }
}
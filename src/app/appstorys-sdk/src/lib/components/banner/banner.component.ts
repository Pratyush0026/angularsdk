import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackUserActionService } from '../../utils/track-user-action.service';
import { ActionType } from '../../types/action.types';
import { Campaign, CampaignData } from '../../interfaces/compaign';
import { findCampaignByType } from '../../utils/compaign/campaign-finder.util';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit, OnChanges {
  @Input() campaignData?: CampaignData | null;
  
  bannerVisible = true;
  data?: Campaign;

  constructor(private userActionTrackService: TrackUserActionService) {}

  ngOnInit(): void {
    this.initializeBanner();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['campaignData']) {
      this.initializeBanner();
    }
  }

  private initializeBanner(): void {
    if (!this.campaignData) return;
    
    this.data = findCampaignByType(this.campaignData.campaigns, 'BAN');

    if (this.data) {
      this.trackImpression();
    }
  }

  private async trackImpression(): Promise<void> {
    if (!this.campaignData?.user_id || !this.data?.id) return;

    try {
      await this.userActionTrackService.trackUserAction(
        this.campaignData.user_id,
        this.data.id,
        ActionType.IMPRESSION
      );
    } catch (error) {
      console.error('Error tracking impression:', error);
    }
  }

  async onBannerClick(): Promise<void> {
    if (!this.campaignData?.user_id || !this.data?.id) return;

    if (this.data.details.link) {
      window.open(this.data.details.link, '_blank');
    }

    try {
      await this.userActionTrackService.trackUserAction(
        this.campaignData.user_id,
        this.data.id,
        ActionType.CLICK
      );
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  }

  closeBanner(): void {
    this.bannerVisible = false;
  }
}
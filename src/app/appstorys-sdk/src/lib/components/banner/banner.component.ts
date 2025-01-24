import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackUserActionService } from '../../utils/track-user-action.service';
import { CAMPAIGN_TYPES, CampaignData, MediaCampaign } from '../../interfaces/compaign';
import { ActionType } from '../../types/action.types';

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
  data?: MediaCampaign;

  constructor(private userActionTrackService: TrackUserActionService) {}

  ngOnInit(): void {
    this.initializeBanner();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['campaignData']) {
      // this.initializeBanner();
    }
  }

  private initializeBanner(): void {
    if (!this.campaignData?.campaigns) return;

    const banners = this.campaignData.campaigns
      .filter(campaign => campaign.campaign_type === CAMPAIGN_TYPES.BANNER) as MediaCampaign[];

    if (banners.length > 0) {
      this.data = banners[0];
      this.trackImpression();
    }
  }

  getWidth(): string {
    return this.data?.details?.width ? `${this.data.details.width}px` : '100%';
  }

  getHeight(): string {
    return this.data?.details?.height ? `${this.data.details.height}px` : 'auto';
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
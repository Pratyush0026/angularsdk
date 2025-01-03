import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackUserActionService } from '../../utils/track-user-action.service';
import { CampaignBanner } from '../../utils/user-data.type';
import { ActionType } from '../../types/action.types';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit, OnChanges {
  @Input() campaigns: any[] = [];
  @Input() user_id: string = '';
  
  bannerVisible = true;
  data: CampaignBanner | undefined;

  constructor(private userActionTrackService: TrackUserActionService) {}

  ngOnInit(): void {
    this.initializeBanner();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['campaigns']) {
      this.initializeBanner();
    }
  }

  private initializeBanner(): void {
    this.data = this.campaigns.find(
      (campaign: any) => campaign.campaign_type === 'BAN'
    ) as CampaignBanner;

    if (this.data) {
      this.trackImpression();
    }
  }

  private async trackImpression(): Promise<void> {
    try {
      await this.userActionTrackService.trackUserAction(
        this.user_id,
        this.data?.id || '',
        ActionType.IMPRESSION
      );
    } catch (error) {
      console.error('Error tracking impression:', error);
    }
  }

  async onBannerClick(): Promise<void> {
    if (!this.data?.id) return;

    if (this.data.details.link) {
      window.open(this.data.details.link, '_blank');
    }

    try {
      await this.userActionTrackService.trackUserAction(
        this.user_id,
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
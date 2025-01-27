import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackUserActionService } from '../../utils/track-user-action.service';
import { ActionType } from '../../types/action.types';
import { CampaignData, MediaCampaign, CAMPAIGN_TYPES } from '../../interfaces/compaign';

@Component({
  selector: 'app-floater',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floater.component.html',
  styleUrls: ['./floater.component.css']
})
export class FloaterComponent implements OnInit, OnChanges {
  @Input() campaignData?: CampaignData | null;
  
  data?: MediaCampaign;

  constructor(private userActionTrackService: TrackUserActionService) {}

  ngOnInit(): void {
    this.initializeFloater();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['campaignData']) {
      // this.initializeFloater();
    }
  }

  private initializeFloater(): void {
    if (!this.campaignData?.campaigns) return;

    const floaters = this.campaignData.campaigns
      .filter(campaign => campaign.campaign_type === CAMPAIGN_TYPES.FLOATER) as MediaCampaign[];
    
    if (floaters.length > 0) {
      this.data = floaters[0];
      this.trackImpression();
    }
  }

  getPosition(): { [key: string]: string } {
    return {
      right: '20px',
      left: 'auto'
    };
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

  async onFloaterClick(): Promise<void> {
    
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
}
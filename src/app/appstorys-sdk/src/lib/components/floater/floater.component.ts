import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackUserActionService } from '../../utils/track-user-action.service';
import { ActionType } from '../../types/action.types';
import { Campaign, CampaignData } from '../../interfaces/compaign';
import { findCampaignByType } from '../../utils/compaign/campaign-finder.util';

@Component({
  selector: 'app-floater',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floater.component.html',
  styleUrls: ['./floater.component.css']
})
export class FloaterComponent implements OnInit, OnChanges {
  @Input() campaignData?: CampaignData | null;
  
  data?: Campaign;

  constructor(private userActionTrackService: TrackUserActionService) {}

  ngOnInit(): void {
    this.initializeFloater();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['campaignData']) {
      this.initializeFloater();
    }
  }

  private initializeFloater(): void {
    if (!this.campaignData) return;
    
    this.data = findCampaignByType(this.campaignData.campaigns, 'FLT');

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

  async onFloaterClick(): Promise<void> {
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
}
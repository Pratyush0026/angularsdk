import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackUserActionService } from '../../utils/track-user-action.service';
import { UserData, CampaignFloater } from '../../utils/user-data.type';
import { ActionType } from '../../types/action.types';

@Component({
  selector: 'app-floater',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floater.component.html',
  styleUrls: ['./floater.component.css']
})
export class FloaterComponent implements OnInit, OnChanges {
  @Input() campaigns: any[] = [];
  @Input() user_id: string = '';
  data: CampaignFloater | undefined;

  constructor(private userActionTrackService: TrackUserActionService) {}

  ngOnInit(): void {
    this.initializeFloater();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['campaigns']) {
      this.initializeFloater();
    }
  }

  private initializeFloater(): void {
    this.data = this.campaigns.find(
      (campaign: any) => campaign.campaign_type === 'FLT'
    ) as CampaignFloater;

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

  async onFloaterClick(): Promise<void> {
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
}
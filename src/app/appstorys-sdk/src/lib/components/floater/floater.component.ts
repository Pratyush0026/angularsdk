// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-floater',
//   templateUrl: './floater.component.html',
//   styleUrls: ['./floater.component.css']
// })
// export class FloaterComponent {
//   onBannerClick(): void {
//     console.log('Banner clicked!');
//   }
// }


import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TrackUserActionService } from '../../utils/track-user-action.service'; // Service to track actions
import { UserData, CampaignFloater } from '../../utils/user-data.type'; // Import the UserData and CampaignFloater types
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-floater',
  templateUrl: './floater.component.html',
  styleUrls: ['./floater.component.css'],
})
export class FloaterComponent implements OnInit, OnChanges {
  @Input() campaigns: any[] = [];
  @Input() user_id: string = '';
  access_token: string | null = null;
  data: CampaignFloater | undefined;

  constructor(private userActionTrackService: TrackUserActionService) {}

  ngOnInit(): void {
    // Find the campaign of type 'FLT'
    this.data = this.campaigns.find(
      (campaign: any) => campaign.campaign_type === 'FLT'
    ) as CampaignFloater;

    if (this.data) {
      this.trackImpression();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['campaigns'] && this.campaigns) {
      this.data = this.campaigns.find(
        (campaign: any) => campaign.campaign_type === 'FLT'
      ) as CampaignFloater;
      if (this.data) {
        this.trackImpression();
      }
    }
  }

  // Track impression when the floater is displayed
  async trackImpression(): Promise<void> {
    try {
      await this.userActionTrackService.trackUserAction(
        this.user_id,
        this.data?.id || '',
        'IMP'
      );
    } catch (error) {
      console.error('Error in tracking impression:', error);
    }
  }

  // Handle click action
  async onFloaterClick(): Promise<void> {
    if (this.data?.details.link) {
      window.open(this.data.details.link, '_blank');
    }

    try {
      await this.userActionTrackService.trackUserAction(
        this.user_id,
        this.data?.id || '',
        'CLK'
      );
    } catch (error) {
      console.error('Error in tracking click:', error);
    }
  }
}

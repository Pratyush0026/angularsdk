import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackUserActionService } from '../../utils/track-user-action.service';
import { CAMPAIGN_TYPES, CampaignData, MediaCampaign } from '../../interfaces/compaign';
import { ActionType } from '../../types/action.types';
import { SlideScreenNewComponent } from "../slide-screen-new/slide-screen-new.component";

interface StoryGroup {
  thumbnail: string;
  name: string;
  ringColor: string;
  nameColor: string;
  slides: any[];
}

interface Campaign {
  id: string;
  campaign_type: string;
  details: StoryGroup[];
}

@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [CommonModule, SlideScreenNewComponent],
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.css']
})
export class StoriesComponent implements OnInit, OnChanges {
  @Input() campaignData?: CampaignData | null;
  campaigns: any[] = [];
  userId: string | undefined;

  slideScreenVisible = false;
  slidesData: Campaign | null = null;
  currentGroupIndex: number | null = null;
  data: Campaign | undefined;

  constructor(private userActionTrackService: TrackUserActionService) {}
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
    this.initializeStories();
  }

  private initializeStories(): void {
    if (!this.campaigns) return;

    this.campaigns = this.campaignData!.campaigns;

    const stories = this.campaigns.find(val => val.campaign_type === 'STR');

    if (stories) {
      this.data = stories;
      this.userId = this.campaignData?.user_id;
      // this.trackImpression();
    }
  }

  handleOpenSlideScreen(storyGroupIndex: number) {
    this.slideScreenVisible = true;
    this.slidesData = this.data!;
    this.currentGroupIndex = storyGroupIndex;
    // if (this.data) {
    //   this.userActionTrackService.trackAction(this.user_id, this.data.id, 'CLK');
    // }
  }
}
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';
import { TrackUserActionService } from '../../utils/track-user-action.service';
import { CAMPAIGN_TYPES, CampaignData, MediaCampaign } from '../../interfaces/compaign';
import { ActionType } from '../../types/action.types';

interface Campaign {
  id: string;
  campaign_type: string;
  details: {
    small_video: string;
    large_video: string;
    link: string;
  };
}

@Component({
  selector: 'app-pip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pip.component.html',
  styleUrls: ['./pip.component.css']
})
export class PipComponent implements OnInit, OnDestroy {
  // @Input() accessToken!: string;
  // @Input() campaigns!: Campaign[];
  @Input() campaignData?: CampaignData | null;
  campaigns: any[] = [];
  // @Input() userId!: string;
  @ViewChild('videoRef') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('pipRef') pipRef!: ElementRef;

  pipVisible = true;
  fullScreenPipVisible = false;
  isPaused = false;
  pipData: Campaign | undefined;
  
  position = {
    x: window.innerWidth - 180,
    y: window.innerHeight - 230
  };
  
  dragging = false;
  rel = { x: 0, y: 0 };
  dragStart = { x: 0, y: 0 };
  readonly margin = 20;

  private resizeListener: () => void;

  constructor(private userActionTrackService: TrackUserActionService) {
    this.resizeListener = this.handleResize.bind(this);
  }

  ngOnInit(): void {
    window.addEventListener('resize', this.resizeListener);
    this.initializePipData();
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListener);
    this.enableSelection();
  }

  private async initializePipData(): Promise<void> {

    this.campaigns = this.campaignData!.campaigns;
    const pip = this.campaigns.find(val => val.campaign_type === 'PIP');
    if (pip) {
      this.pipData = pip;

      this.trackImpression();
      // try {
      //   await this.userActionTrackService.trackAction(this.userId, data.id, 'IMP');
      // } catch (error) {
      //   console.error('Error in tracking impression:', error);
      // }
    }
  }

  private async trackImpression(): Promise<void> {
    if (!this.campaignData?.user_id || !this.pipData?.id) return;

    try {
      await this.userActionTrackService.trackUserAction(
        this.campaignData.user_id,
        this.pipData.id,
        ActionType.IMPRESSION
      );
    } catch (error) {
      console.error('Error tracking impression:', error);
    }
  }

  handleStart(e: MouseEvent | TouchEvent): void {
    if (e.cancelable) {
      e.preventDefault();
    }

    const target = e.target as HTMLElement;
    if (target.closest('.close-button')) {
      return;
    }

    const clientX = e instanceof TouchEvent ? e.touches[0].clientX : e.clientX;
    const clientY = e instanceof TouchEvent ? e.touches[0].clientY : e.clientY;

    this.dragging = true;
    this.dragStart = { x: clientX, y: clientY };

    const rect = this.pipRef.nativeElement.getBoundingClientRect();
    this.rel = {
      x: clientX - rect.left,
      y: clientY - rect.top
    };

    this.disableSelection();
  }

  handleMove(e: MouseEvent | TouchEvent): void {
    if (!this.dragging) return;

    const clientX = e instanceof TouchEvent ? e.touches[0].clientX : e.clientX;
    const clientY = e instanceof TouchEvent ? e.touches[0].clientY : e.clientY;

    const newX = clientX - this.rel.x;
    const newY = clientY - this.rel.y;

    this.position = {
      x: Math.max(this.margin, Math.min(newX, window.innerWidth - 150 - this.margin)),
      y: Math.max(this.margin, Math.min(newY, window.innerHeight - 200 - this.margin))
    };
  }

  handleEnd(e: MouseEvent | TouchEvent): void {
    if (this.dragging) {
      const endX = e instanceof TouchEvent ? e.changedTouches[0].clientX : e.clientX;
      const endY = e instanceof TouchEvent ? e.changedTouches[0].clientY : e.clientY;

      const distanceMoved = Math.sqrt(
        Math.pow(endX - this.dragStart.x, 2) +
        Math.pow(endY - this.dragStart.y, 2)
      );

      const target = e.target as HTMLElement;
      if (distanceMoved < 5 && !target.closest('.close-button')) {
        this.handleVideoClick();
      }
    }
    this.dragging = false;
    this.enableSelection();
  }

  private handleResize(): void {
    this.position = {
      x: Math.min(this.position.x, window.innerWidth - 150 - this.margin),
      y: Math.min(this.position.y, window.innerHeight - 200 - this.margin)
    };
  }

  handleVideoClick(): void {
    this.fullScreenPipVisible = true;
    if(this.fullScreenPipVisible){
      this.trackImpression();
    }
    document.body.style.overflow = 'hidden';
  }

  handleCloseClick(e: Event): void {
    e.stopPropagation();
    this.pipVisible = false;
    document.body.style.overflow = 'auto';
  }

  togglePause(): void {
    this.isPaused = !this.isPaused;
    if (this.videoRef) {
      if (this.isPaused) {
        this.videoRef.nativeElement.pause();
      } else {
        this.videoRef.nativeElement.play();
      }
    }
  }

  closeFullScreen(): void {
    this.fullScreenPipVisible = false;
    document.body.style.overflow = 'auto';
  }

  private disableSelection(): void {
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.userSelect = 'none';
    // document.body.style.msUserSelect = 'none';
    document.body.style.overflow = 'hidden';
  }

  private enableSelection(): void {
    document.body.style.userSelect = 'auto';
    document.body.style.webkitUserSelect = 'auto';
    document.body.style.userSelect = 'auto';
    // document.body.style.msUserSelect = 'auto';
    document.body.style.overflow = this.fullScreenPipVisible ? 'hidden' : 'auto';
  }

  async trackClick(): Promise<void> {
    if (!this.campaignData?.user_id || !this.pipData?.id) return;

    try {
      await this.userActionTrackService.trackUserAction(
        this.campaignData.user_id,
        this.pipData.id,
        ActionType.CLICK
      );
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  }
}
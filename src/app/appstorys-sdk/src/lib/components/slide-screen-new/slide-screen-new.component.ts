import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackUserActionService } from '../../utils/track-user-action.service';
import { CAMPAIGN_TYPES, CampaignData, MediaCampaign } from '../../interfaces/compaign';
import { ActionType } from '../../types/action.types';

@Component({
  selector: 'app-slide-screen-new',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slide-screen-new.component.html',
  styleUrls: ['./slide-screen-new.component.css']
})
export class SlideScreenNewComponent implements OnInit, OnDestroy {
  @Input() data: any;
  @Input() index!: number;
  @Input() storyCampaignId!: string;
  @Input() userId!: string;
  @Output() slideScreenVisibleChange = new EventEmitter<boolean>();

  content: any[] = [];
  current = 0;
  currentGroupIndex!: number;
  progress = 0;
  isPaused = false;
  isContentReady = false;
  currentDuration = 5000;

  private animationFrameId: number | null = null;
  private startTime: number | null = null;
  private elapsed = 0;
  private videoElement: HTMLVideoElement | null = null;

  constructor(private userActionTrackService: TrackUserActionService) {}

  ngOnInit() {
    this.currentGroupIndex = this.index;
    this.initializeContent();
  }

  initializeContent() {
    if (this.data?.details[this.currentGroupIndex]?.slides) {
      this.content = this.data.details[this.currentGroupIndex].slides.map(
        (slide: any) => ({ ...slide, finish: 0 })
      );
    }
  }

  startProgress(duration: number) {
    if (!this.isContentReady) return;

    this.startTime = performance.now();

    const animate = (timestamp: number) => {
      if (this.isPaused) return;

      if (!this.startTime) {
        this.startTime = timestamp;
      }

      const elapsed = timestamp - this.startTime + this.elapsed;
      const progressValue = Math.min((elapsed / duration) * 100, 100);
      this.progress = progressValue;

      if (progressValue < 100) {
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        this.handleNext();
      }
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.elapsed += performance.now() - (this.startTime || 0);
      if (this.videoElement && this.content[this.current]?.video) {
        this.videoElement.pause();
      }
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
    } else {
      if (this.videoElement && this.content[this.current]?.video) {
        this.videoElement.play();
      }
      this.startProgress(this.currentDuration);
    }
  }

  handleNext() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.elapsed = 0;

    if (this.current < this.content.length - 1) {
      this.content[this.current].finish = 1;
      this.current++;
    } else if (this.currentGroupIndex < this.data.details.length - 1) {
      this.currentGroupIndex++;
      this.current = 0;
      this.initializeContent();
    } else {
      this.close();
    }
  }

  handlePrevious() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.elapsed = 0;

    if (this.current > 0) {
      this.content[this.current].finish = 0;
      this.current--;
    } else if (this.currentGroupIndex > 0) {
      this.currentGroupIndex--;
      const prevGroupSlides = this.data.details[this.currentGroupIndex].slides;
      this.content = prevGroupSlides.map((slide: any) => ({ ...slide, finish: 0 }));
      this.current = prevGroupSlides.length - 1;
    }
  }

  close() {
    this.slideScreenVisibleChange.emit(false);
  }

  onImageLoaded() {
    this.isContentReady = true;
    this.currentDuration = 5000;
    this.trackImpression();
  }

  onVideoLoaded(event: Event) {
    const video = event.target as HTMLVideoElement;
    this.currentDuration = video.duration * 1000;
    this.isContentReady = true;
    this.trackImpression();
  }

  async trackImpression() {

    try {
      await this.userActionTrackService.trackUserAction(
        this.userId,
        this.storyCampaignId,
        ActionType.IMPRESSION,
        this.content[this.current].id
      );
      this.startProgress(this.currentDuration);
    } catch (error) {
      console.error('Error tracking impression:', error);
    }
  }

  async sendClick() {

    try {
      await this.userActionTrackService.trackUserAction(
        this.userId,
        this.storyCampaignId,
        ActionType.CLICK,
        this.content[this.current].id
      );
      this.startProgress(this.currentDuration);
    } catch (error) {
      console.error('Error tracking impression:', error);
    }
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
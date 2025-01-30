import { Component, HostListener, Input, OnInit, OnChanges, SimpleChanges, ViewChildren, AfterViewInit, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackUserActionService } from '../../utils/track-user-action.service';
import { CAMPAIGN_TYPES, CampaignData, MediaCampaign } from '../../interfaces/compaign';
import { ActionType } from '../../types/action.types';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.css'],
  imports: [CommonModule],
  standalone: true,
})
export class WidgetsComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() campaignData?: CampaignData | null;
  @ViewChildren('carouselImage') carouselImages!: QueryList<ElementRef>;

  data?: MediaCampaign;
  items: string[] = [];
  currentIndex: number = 1;
  transition: string = 'transform 0.5s ease-in-out';
  isMobileView: boolean = false;
  private touchStartX: number = 0;
  private touchEndX: number = 0;
  private observer: IntersectionObserver | null = null;
  private trackedImageIds: Set<string> = new Set();
  private autoSlideInterval: any;

  constructor(
    private userActionTrackService: TrackUserActionService,
    private elementRef: ElementRef
  ) {
    this.updateViewMode();
  }

  ngOnInit(): void {
    this.initializeWidgets();
    this.startAutoSlide();
  }

  ngAfterViewInit(): void {
    if(this.data?.details.type === 'half'){
      this.trackImpressionForHalfWidget();
    } else{
      this.setupIntersectionObserver();
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.stopAutoSlide();
  }

  private startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // 5000 milliseconds = 5 seconds
  }

  // New method to stop auto-sliding
  private stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  private setupIntersectionObserver(): void {
    const options = {
      root: null,
      threshold: 0.5
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const imageId = this.data?.details.widget_images![this.getCurrentSlideIndex()].id;
          if (imageId && !this.trackedImageIds.has(imageId)) {
            this.trackImpression();
            this.trackedImageIds.add(imageId); // Add the image ID to tracked set
          }
        }
      });
    }, options);

    // Observe all carousel images
    this.carouselImages.forEach(imageRef => {
      this.observer?.observe(imageRef.nativeElement);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['campaignData']) {
      this.initializeWidgets();
    }
  }

  private initializeWidgets(): void {
    console.log('Widgets campaign data:', this.campaignData);
    if (!this.campaignData?.campaigns) return;

    const widgets = this.campaignData.campaigns
      .filter(campaign => campaign.campaign_type === CAMPAIGN_TYPES.WIDGETS) as MediaCampaign[];

    if (widgets.length > 0) {
      this.data = widgets[0];
      this.items = this.data.details.widget_images!.map(widget => widget.image);

      console.log('Widgets data:', this.data);
    }
  }

  getWidth(): string {
    return this.data?.details?.width ? `${this.data.details.width}px` : '100%';
  }

  getHeight(): string {
    return this.data?.details?.height ? `${this.data.details.height}px` : '200px';
  }

  private async trackImpression(): Promise<void> {
    if (!this.campaignData?.user_id || !this.data?.id) return;

    const imageId = this.data.details.widget_images![this.getCurrentSlideIndex()].id;
    if (this.trackedImageIds.has(imageId)) return; // Skip if already tracked

    try {
      await this.userActionTrackService.trackUserAction(
        this.campaignData.user_id,
        this.data.id,
        ActionType.IMPRESSION,
        undefined,
        imageId
      );
    } catch (error) {
      console.error('Error tracking impression:', error);
    }
  }

  private async trackImpressionForHalfWidget(): Promise<void> {
    if (!this.campaignData?.user_id || !this.data?.id) return;

    try {
      await this.userActionTrackService.trackUserAction(
        this.campaignData.user_id,
        this.data.id,
        ActionType.IMPRESSION,
        undefined,
        this.data.details.widget_images![0].id
      );
      await this.userActionTrackService.trackUserAction(
        this.campaignData.user_id,
        this.data.id,
        ActionType.IMPRESSION,
        undefined,
        this.data.details.widget_images![1].id
      );
    } catch (error) {
      console.error('Error tracking impression:', error);
    }
  }

  async trackClicks(index?: number): Promise<void> {
    if (!this.campaignData?.user_id || !this.data?.id) return;

    try {

      const slideIndex = index !== undefined ? index : this.getCurrentSlideIndex();
      const selectedImage = this.data.details.widget_images![slideIndex];

      await this.userActionTrackService.trackUserAction(
        this.campaignData.user_id,
        this.data.id,
        ActionType.CLICK,
        undefined,
        selectedImage.id,
      );

      window.open(selectedImage.link, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  }

  // async onWidgetsClick(): Promise<void> {
  //   if (!this.campaignData?.user_id || !this.data?.id) return;

  //   try {
  //     await this.userActionTrackService.trackUserAction(
  //       this.campaignData.user_id,
  //       this.data.id,
  //       ActionType.CLICK
  //     );
  //   } catch (error) {
  //     console.error('Error tracking click:', error);
  //   }
  // }

  @HostListener('window:resize', [])
  updateViewMode(): void {
    this.isMobileView = window.innerWidth <= 768; // Adjust threshold for mobile view
  }

  get translateX(): number {
    return -this.currentIndex * 100;
  }

  nextSlide(): void {
    this.stopAutoSlide(); // Stop the current interval
    this.transition = 'transform 0.5s ease-in-out';
    this.currentIndex++;

    if (this.currentIndex === this.items.length + 1) {
      setTimeout(() => {
        this.transition = 'none';
        this.currentIndex = 1;
      }, 500);
    }
    this.startAutoSlide(); // Restart the interval
  }

  prevSlide(): void {
    this.stopAutoSlide(); // Stop the current interval
    this.transition = 'transform 0.5s ease-in-out';
    this.currentIndex--;

    if (this.currentIndex === 0) {
      setTimeout(() => {
        this.transition = 'none';
        this.currentIndex = this.items.length;
      }, 500);
    }
    this.startAutoSlide(); // Restart the interval
  }

  onTouchStart(event: TouchEvent): void {
    this.stopAutoSlide(); // Stop auto-sliding when user starts touching
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchMove(event: TouchEvent): void {
    this.touchEndX = event.touches[0].clientX;
  }

  onTouchEnd(): void {
    const deltaX = this.touchStartX - this.touchEndX;
    const threshold = 50;

    if (deltaX > threshold) {
      this.nextSlide();
    } else if (deltaX < -threshold) {
      this.prevSlide();
    } else {
      this.startAutoSlide(); // Restart auto-sliding if no slide change occurred
    }

    this.touchStartX = 0;
    this.touchEndX = 0;
  }

  getCurrentSlideIndex(): number {
    // Map the currentIndex to the original items array
    if (this.currentIndex === 0) return this.items.length - 1;
    if (this.currentIndex === this.items.length + 1) return 0;
    return this.currentIndex - 1;
  }
}

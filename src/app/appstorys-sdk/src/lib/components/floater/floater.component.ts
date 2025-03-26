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

    this.fetchMedia('https://appstorysmediabucket.s3.amazonaws.com/banners/WhatsApp_Image_2025-01-23_at_11.36.29.jpeg');
  }

  // testing
  async fetchMedia(url: string): Promise<Blob | null> {
    try {
      console.log("IAUSFABIABCVIABFUIBAEFIUCBAIBFIUBF")
    // Try direct fetch first with no-cors mode
      const response = await fetch(url, { mode: 'cors', method: 'GET', headers:{
        "X-Force-Preflight": "true",
        "Test-Heaader": "KJBASDFIBk"
      } });
      console.log(response)
      if (response.ok) {
      const blob = await response.blob();
      if (blob.size > 0) {
      return blob;
      }
      }
      } catch (error) {
      console.warn('[MediaExtractorService] Direct fetch failed:', error);
      }
    
    
    
    // If direct fetch fails, try the Image element approach
    try {
    const blob = await this.fetchViaImgElement(url);
    if (blob) return blob;
    } catch (error) {
    console.warn('[MediaExtractorService] Image element approach failed:', error);
    }
    
    
    
    // If both approaches fail, return null to use direct URL
    console.log('[MediaExtractorService] All fetch attempts failed, using direct URL');
    return null;
    }
    
    
    
    private fetchViaImgElement(url: string): Promise<Blob | null> {
    return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Set this before src
    
    
    
    const timeoutId = setTimeout(() => {
    img.src = '';
    resolve(null);
    }, 10000);
    
    
    
    img.onload = () => {
    clearTimeout(timeoutId);
    try {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    
    
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
    resolve(null);
    return;
    }
    
    
    
    ctx.drawImage(img, 0, 0);
    canvas.toBlob((blob) => {
    if (blob && blob.size > 0) {
    resolve(blob);
    } else {
    resolve(null);
    }
    }, 'image/png');
    } catch (error) {
    console.warn('[MediaExtractorService] Canvas operation failed:', error);
    resolve(null);
    }
    };
    
    
    
    img.onerror = () => {
    clearTimeout(timeoutId);
    console.warn('[MediaExtractorService] Image load failed:', url);
    resolve(null);
    };
    
    
    
    img.src = url; // Set src after setting crossOrigin
    });
    }
  // testing

  getPosition(): { [key: string]: string } {
    return this.data?.details?.position === 'left' ? {
      alignItems: 'flex-start',
      // right: '20px',
      left: '20px'
    } : {
      alignItems: 'flex-end',
      right: '20px',
      // left: '20px'
    };
  }

  getWidth(): string {
    return this.data?.details?.width ? `${this.data.details.width}px` : '60px';
  }

  getHeight(): string {
    return this.data?.details?.height ? `${this.data.details.height}px` : '60px';
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
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FloaterComponent } from '../appstorys-sdk/src/lib/components/floater/floater.component';
import { BannerComponent } from '../appstorys-sdk/src/lib/components/banner/banner.component';
import { Feature } from './models/feature.model';
import { Testimonial } from './models/testimonial.model';
import { features } from './data/features.data';
import { testimonials } from './data/testimonials.data';
import { BehaviorSubject } from 'rxjs';
import { AppStorysService } from '../appstorys-sdk/src/lib/utils/app-storys.service';
import { CampaignService } from '../appstorys-sdk/src/lib/utils/compaign/campaign.service';
import { CampaignData } from '../appstorys-sdk/src/lib/interfaces/compaign';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FloaterComponent,
    BannerComponent
  ],
  providers: [CampaignService, AppStorysService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private readonly appId = '37ca2d75-8484-4cc1-97ed-d9475ce5a631';
  private readonly accountId = '4e109ac3-be92-4a5c-bbe6-42e6c712ec9a';
  private readonly user_id = 'akdnnsa';
  private readonly screenName = 'Home Screen';
  
  readonly features: Feature[] = features;
  readonly testimonials: Testimonial[] = testimonials;

  isLoading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);
  campaignData$ = new BehaviorSubject<CampaignData | null>(null);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private campaignService: CampaignService
  ) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (!this.isBrowser()) {
      return;
    }

    this.isLoading$.next(true);
    this.campaignService.initializeCampaigns(
      this.accountId,
      this.appId,
      this.user_id,
      this.screenName
    ).finally(() => {
      this.isLoading$.next(false);
    });

    this.campaignService.error$.subscribe(error => {
      this.error$.next(error);
    });

    this.campaignService.campaignData$.subscribe(data => {
      this.campaignData$.next(data);
    });
  }
}
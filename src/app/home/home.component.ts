import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FloaterComponent } from '../appstorys-sdk/src/lib/components/floater/floater.component';
import { BannerComponent } from '../appstorys-sdk/src/lib/components/banner/banner.component';
import { AppStorysService } from '../appstorys-sdk/src/lib/utils/app-storys.service';
import { UserData } from '../appstorys-sdk/src/lib/utils/user-data.type';
import { Feature } from './models/feature.model';
import { Testimonial } from './models/testimonial.model';
import { features } from './data/features.data';
import { testimonials } from './data/testimonials.data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FloaterComponent,
    BannerComponent // Add BannerComponent to imports
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  readonly appId = '37ca2d75-8484-4cc1-97ed-d9475ce5a631';
  readonly accountId = '4e109ac3-be92-4a5c-bbe6-42e6c712ec9a';
  readonly user_id = 'akdnnsa';
  readonly screenName = 'Home Screen';
  
  data: UserData | null = null;
  error: string | null = null;
  features: Feature[] = features;
  testimonials: Testimonial[] = testimonials;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appStorysService: AppStorysService
  ) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  async ngOnInit() {
    if (!this.isBrowser()) return;

    try {
      await this.appStorysService.verifyAccount(this.accountId, this.appId);
      const campaigns = await this.appStorysService.trackScreen(this.appId, this.screenName);
      
      console.log('campaigns:', campaigns);
      
      if (campaigns) {
        const verifyUser = await this.appStorysService.verifyUser(this.user_id, campaigns);
        if (verifyUser) {
          this.data = verifyUser;
        }
      } else {
        this.error = 'No campaigns available';
      }
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error initializing home component:', error);
    }
  }
}
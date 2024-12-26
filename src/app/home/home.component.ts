import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FloaterComponent, BannerComponent } from '../appstorys-sdk/src/public-api';

import { WidgetsComponent } from "../widgets/widgets.component";
import { AppStorysService } from '../appstorys-sdk/src/public-api'; // Assuming you have a service for AppStorys SDK
import { UserData } from '../appstorys-sdk/src/lib/utils/user-data.type'; // Assuming you have UserData model

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [HttpClientModule, WidgetsComponent, FloaterComponent, BannerComponent],
})
export class HomeComponent implements OnInit {
  appId = '37ca2d75-8484-4cc1-97ed-d9475ce5a631';
  accountId = '4e109ac3-be92-4a5c-bbe6-42e6c712ec9a';
  user_id = 'akdnnsa';
  screenName = 'Home Screen';
  attributes = {
    key: 'value',
  };

  access_token: string | null = null;
  data: UserData | undefined;

  features = [
    {
      title: 'Feature 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      icon: '🚀'
    },
    {
      title: 'Feature 2',
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      icon: '⚡'
    },
    {
      title: 'Feature 3',
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      icon: '🎯'
    }
  ];

  testimonials = [
    {
      name: 'John Doe',
      comment: 'Amazing service! Exactly what I was looking for.',
      role: 'CEO, Tech Corp'
    },
    {
      name: 'Jane Smith',
      comment: 'The best solution in the market. Highly recommended!',
      role: 'CTO, Innovation Inc'
    }
  ];

  constructor(private appStorysService: AppStorysService) {}

  async ngOnInit() {
    // Initialize the AppStorys SDK and track the screen
    await this.appStorysService.verifyAccount(this.accountId, this.appId);
    const campaigns = await this.appStorysService.trackScreen(this.appId, this.screenName);

    // Verify the user and fetch user data
    const verifyUser = await this.appStorysService.verifyUser(this.user_id, campaigns);
    if (verifyUser) {
      this.data = verifyUser;
    }

    // Track the user
    // await this.appStorysService.trackUser(this.user_id, this.attributes);

    // Retrieve the access token
    this.access_token = await this.getAccessToken();
  }

  // Method to get the access token
  async getAccessToken(): Promise<string | null> {
    // Replace with actual token fetching logic (e.g., from local storage or API)
    return localStorage.getItem('access_token');
  }
}

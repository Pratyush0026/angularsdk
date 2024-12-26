import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface Attributes {
  [key: string]: any;
}

interface UserData {
  user_id: string;
  campaigns: any[];
}

@Injectable({
  providedIn: 'root',
})
export class VerifyUserService {
  private apiUrl = 'https://backend.appstorys.com/api/v1/users/track-user/';

  constructor(private http: HttpClient) {}

  async getItem(key: string): Promise<string | null> {
    return localStorage.getItem(key);
  }

  async verifyUser(userId: string, campaigns: any[], attributes?: Attributes): Promise<UserData | undefined> {
    try {
      if (!campaigns || campaigns.length === 0) {
        console.log('No campaigns found');
        return;
      }

      const appId = await this.getItem('app_id');
      const accessToken = await this.getItem('access_token');

      if (!appId || !accessToken) {
        console.error('Missing app_id or access_token');
        return;
      }

      const body: any = {
        user_id: userId,
        app_id: appId,
        campaign_list: campaigns,
      };

      if (attributes) {
        body.attributes = attributes;
      }

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      });

      const response = await this.http.post(this.apiUrl, body, { headers }).toPromise();

      if (response) {
        const data: any = response;
        return { user_id: data.user_id, campaigns: data.campaigns };
      } else {
        console.error('Failed to verify user');
        return { user_id: userId, campaigns };
      }
    } catch (error) {
      console.error('Error in verifyUser', error);
      return { user_id: userId, campaigns };
    }
  }
}

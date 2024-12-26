import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

type ActionType = 'IMP' | 'CLK' | 'CNV';

@Injectable({
  providedIn: 'root',
})
export class TrackUserActionService {
  private apiUrl = 'https://backend.appstorys.com/api/v1/users/track-action/';

  constructor(private http: HttpClient) {}

  async getAccessToken(): Promise<string | null> {
    return localStorage.getItem('access_token');
  }

  async trackUserAction(
    userId: string,
    campaignId: string,
    eventType: ActionType,
    storySlide?: string
  ): Promise<any> {
    const accessToken = await this.getAccessToken();
    if (!accessToken) {
      console.error('Access token not found');
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    const body: any = { campaign_id: campaignId, user_id: userId, event_type: eventType };
    if (storySlide) {
      body.story_slide = storySlide;
    }

    return this.http.post(this.apiUrl, body, { headers }).pipe(
      catchError((error) => {
        console.error('Error in trackUserAction', error);
        return of(null);
      })
    ).toPromise();
  }
}

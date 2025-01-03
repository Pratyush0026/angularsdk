import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { StorageService } from './storage.service';
import { ActionType } from '../types/action.types';

@Injectable({
  providedIn: 'root',
})
export class TrackUserActionService {
  private apiUrl = 'https://backend.appstorys.com/api/v1/users/track-action/';

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  async trackUserAction(
    userId: string,
    campaignId: string,
    eventType: ActionType,
    storySlide?: string
  ): Promise<void> {
    try {
      const accessToken = this.storageService.getItem('access_token');
      if (!accessToken) {
        throw new Error('Access token not found');
      }

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      });

      const body: any = { 
        campaign_id: campaignId, 
        user_id: userId, 
        event_type: eventType 
      };
      
      if (storySlide) {
        body.story_slide = storySlide;
      }

      await this.http.post(this.apiUrl, body, { headers }).pipe(
        catchError((error) => {
          console.error('Error in trackUserAction:', error);
          return of(null);
        })
      ).toPromise();
    } catch (error) {
      console.error('Error in trackUserAction:', error);
    }
  }
}
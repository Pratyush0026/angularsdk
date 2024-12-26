// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { catchError } from 'rxjs/operators';
// import { of } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class TrackUserService {
//   private apiUrl = 'https://backend.appstorys.com/api/v1/users/update-user/';

//   constructor(private http: HttpClient) {}

//   async getAccessToken(): Promise<string | null> {
//     return localStorage.getItem('access_token');
//   }

//   async getAppId(): Promise<string | null> {
//     return localStorage.getItem('app_id');
//   }

//   async trackUser(userId: string, attributes: any): Promise<void> {
//     const accessToken = await this.getAccessToken();
//     const appId = await this.getAppId();
//     if (!accessToken || !appId) {
//       console.error('Required data missing');
//       return;
//     }

//     const headers = new HttpHeaders({
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${accessToken}`,
//     });

//     const body = { user_id: userId, app_id: appId, attributes };

//     return this.http.post(this.apiUrl, body, { headers }).pipe(
//       catchError((error) => {
//         console.error('Error in trackUser', error);
//         return of(null);
//       })
//     ).toPromise();
//   }
// }

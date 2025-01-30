import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MediaCacheService {
  private cache: { [key: string]: string } = {};

  constructor(private http: HttpClient) {}

  fetchAndCacheMedia(imageUrl: string): Observable<string> {
    if (this.cache[imageUrl]) {
      return from(Promise.resolve(this.cache[imageUrl]));
    }

    return this.http.get(imageUrl, { responseType: 'blob' }).pipe(
      map(blob => {
        const cachedUrl = URL.createObjectURL(blob);
        this.cache[imageUrl] = cachedUrl;
        return cachedUrl;
      }),
      catchError(error => {
        console.error('Error fetching image:', error);
        return from(Promise.resolve(imageUrl)); // Fallback to original URL
      })
    );
  }
}
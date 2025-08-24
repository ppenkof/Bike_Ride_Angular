import { Injectable, OnInit, signal,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap, BehaviorSubject, throwError, catchError, of } from 'rxjs';
import { Like } from '../../models';
import { BikeContent } from '../../features/bikesCs';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  
  private apiUrl = 'http://localhost:3030/data/likes';
  private _likeCounts = signal<Record<string, number>>({});
  
  constructor(private http: HttpClient) {}
    like(bikeId: string): Observable<Like> {
      const response = this.http.post<Like>(this.apiUrl, { bikeId }, { headers: { 'Content-Type': 'application/json' } }).pipe(
        tap(likes => {
          console.log(`LikeService -> New like created: ${JSON.stringify(likes)}`);}),
        catchError(error => {
          console.error('LikeService -> Error creating like:', error);
          return throwError(() => error);
        }));
      return response;
  }

  // unlike(likeId: string): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${likeId}`);
  // }

  getCount(bikeId: string): Observable<number> {
    const query = encodeURIComponent(`bikeId="${bikeId}"`);
    const url = `${this.apiUrl}?where=${query}`; 
    return this.http.get<Like[]>(url).pipe(
      map(likes=>likes.length),
      tap(count => {
        const current = this._likeCounts();
        this._likeCounts.set({ ...current, [bikeId]: count });
        console.log(`LikeService -> Get count of likes: ${JSON.stringify(count)}`);
      })
    );
  }

  
  get likeCounts() {
    return this._likeCounts;
  }

  getUserLike(bikeId: string, userId: string | null): Observable<Like | null> {
    if (!userId) {
      return of(null);
    }
    const add = encodeURI('&load=author');
    const query1 = encodeURIComponent(`bikeId="${bikeId}"`);
    const query2 = encodeURIComponent(`=ownerId="${userId}"`);
    return this.http.get<Like[]>(`${this.apiUrl}?where=${query1}${add}${query2}`).pipe(
      map(likes => likes[0] || null)
    );
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Like } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private apiUrl = 'http://localhost:3030/data/likes';

  constructor(private http: HttpClient) {}

  like(productId: string): Observable<Like> {
    return this.http.post<Like>(this.apiUrl, { productId });
  }

  unlike(likeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${likeId}`);
  }

  getCount(productId: string): Observable<number> {
    const query = encodeURIComponent(`productId="${productId}"`);
    return this.http.get<Like[]>(`${this.apiUrl}?where=${query}`).pipe(
      map(likes => likes.length)
    );
  }

  getUserLike(productId: string, userId: string): Observable<Like | null> {
    const query = encodeURIComponent(`productId="${productId}" AND ownerId="${userId}"`);
    return this.http.get<Like[]>(`${this.apiUrl}?where=${query}`).pipe(
      map(likes => likes[0] || null)
    );
  }
}

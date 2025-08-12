import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { Post } from '../../models/post.model'; // !!!!Adjust the import path as necessary

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private apiUrl = 'http://localhost:3000/api';
  private postBehaviorSubject = new BehaviorSubject<Post[]>([]);

  public posts$ = this.postBehaviorSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  getPosts(limit: number = 5): Observable<Post[]> {
    return this.httpClient.get<Post[]>(`${this.apiUrl}/posts?limit={0}`.replace('{0}', limit.toString()))
    .pipe(
        tap(posts => this.postBehaviorSubject.next(posts)));
  }

  createPost(themeName: string, postText: string): Observable<Post> {
    const body = JSON.stringify({ themeName, postText });
    return this.httpClient.post<Post>(`${this.apiUrl}/posts`, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } 
}

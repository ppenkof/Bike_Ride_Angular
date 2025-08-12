import { Injectable, WritableSignal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import  { Theme } from '../../models/theme.model'; // Adjust the import path as necessary



@Injectable({
  providedIn: 'root'
})
export class ThemesService {
  private apiUrl = 'http://localhost:3000/api';
  private themesBehaviorSubject = new BehaviorSubject<Theme[]>([]);

  public themes$: Observable<Theme[]> = this.themesBehaviorSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  getThemes(): Observable<Theme[]> { 
    return this.httpClient.get<Theme[]>(`${this.apiUrl}/themes`)
      .pipe(
        tap(themes => this.themesBehaviorSubject.next(themes))
      );
  }

  createTheme(themeName: string, postText: string): Observable<Theme> {
    return this.httpClient.post<Theme>(`${this.apiUrl}/themes`, { themeName, postText }, {
      withCredentials: true,
    });
  }
}

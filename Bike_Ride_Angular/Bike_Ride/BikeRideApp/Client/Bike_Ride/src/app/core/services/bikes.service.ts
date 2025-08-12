import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import  { Bike } from '../../models/bike.model'; // Adjust the import path as necessary



@Injectable({
  providedIn: 'root'
})
export class BikesService {
  private apiUrl = 'http://localhost:3030/jsonstore';
  private bikesBehaviorSubject = new BehaviorSubject<Bike[]>([]);

  public themes$: Observable<Bike[]> = this.bikesBehaviorSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  getBikes(): Observable<Bike[]> { 
    return this.httpClient.get<Bike[]>(`${this.apiUrl}/bikes`)
      .pipe(
        tap(bikes => this.bikesBehaviorSubject.next(bikes))
      );
  }

  createBike(bikeName: string, postText: string): Observable<Bike> {
    return this.httpClient.post<Bike>(`${this.apiUrl}/bikes`, { bikeName, postText }, {
      withCredentials: true,
    });
  }
}

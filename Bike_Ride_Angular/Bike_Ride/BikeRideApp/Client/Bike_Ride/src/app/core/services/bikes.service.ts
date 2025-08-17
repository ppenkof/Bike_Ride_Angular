import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import  { Bike } from '../../models/bike.model'; // Adjust the import path as necessary
import { BikeRes } from '../../models/bikeRes.model'; // Adjust the import path as necessary



@Injectable({
  providedIn: 'root'
})
export class BikesService {
  private apiUrl = 'http://localhost:3030/jsonstore';
  private bikesBehaviorSubject = new BehaviorSubject<Bike[]>([]);

  public bikes$: Observable<Bike[]> = this.bikesBehaviorSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  // getBikes(): Observable<Bike[]> { 
  //   return this.httpClient.get<Bike[]>(`${this.apiUrl}/bikes`)
  //     .pipe(
  //       tap(bikes => this.bikesBehaviorSubject.next(bikes))
  //     );
  // }

// getBikes(): Observable<Bike[]> {
//   return this.httpClient.get<BikeRes>(`${this.apiUrl}/bikes`)
//     .pipe(
//       tap(response => this.bikesBehaviorSubject.next(Object.values(response ?? {}))),
//       map(response => Object.values(response ?? {}))
//     );
// }


// getBikes(): Observable<Bike[]> {
//   return this.httpClient.get<BikeRes>(`${this.apiUrl}/bikes`)
//     .pipe(map(response => Object.values(response.product ?? {})),
//           tap(bikes => this.bikesBehaviorSubject.next(bikes)));
// }

getBikes(): Observable<Bike[]> {
  return this.httpClient.get<BikeRes>(`${this.apiUrl}/bikes`).pipe(
    map(response =>
      Object.entries(response.products ?? {}).map(([uuid, bikeData]) => ({
        id: uuid,
        bikeName: bikeData.name,
        price: bikeData.price,
        type: bikeData.type,
        description: bikeData.description,
        imageUrl: bikeData.image,
        likes: bikeData.likes
      }))
    ),
    tap(bikes => this.bikesBehaviorSubject.next(bikes))
  );
}



  createBike(bikeName: string, newBike: string): Observable<Bike> {
    return this.httpClient.post<Bike>(`${this.apiUrl}/bikes`, { bikeName, newBike }, {
      withCredentials: false // It is not necessary to send cookies with this request,
    });
  }
}

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

  getBikes(): Observable<Bike[]> {
  return this.httpClient.get<BikeRes>(`${this.apiUrl}/bikes`).pipe(
    map(response =>
      Object.entries(response.products ?? {}).map(([uuid, bikeData]) => ({
        id: uuid,
        bikeName: bikeData.name,
        price: bikeData.price,
        type: bikeData.type,
        description: bikeData.description,
        image: bikeData.image,
        likes: bikeData.likes
      }))
    ),
    tap(bikes => this.bikesBehaviorSubject.next(bikes))
  );
}

createBike(name: string, price: number, type: string, description: string, image: string): Observable<Bike> {
  const payload = {
    name,
    price,
    type,
    description,
    image,
    likes: 0 // default value
  };

  return this.httpClient.post<Bike>(`${this.apiUrl}/bikes`, payload).pipe(
    tap(newBike => {
      const currentBikes = this.bikesBehaviorSubject.value;
      console.log(`New bike created: ${JSON.stringify(newBike)}`);
      this.bikesBehaviorSubject.next([...currentBikes, newBike]);
    })
  );
}

}

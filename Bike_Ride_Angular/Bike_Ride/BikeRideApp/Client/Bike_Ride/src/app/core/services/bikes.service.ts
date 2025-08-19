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
  public likedBikes$: Observable<Bike[]> = this.bikesBehaviorSubject.asObservable();
  constructor(private httpClient: HttpClient) {
    // Initialize the bikes$ observable with the current value of the BehaviorSubject
    this.getBikes().subscribe(data => console.log('Bikes DATA emitted:', data.map(bike => bike.bikeName))); // Log the bikes data when it is emitted
  }

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
    tap(bikes => {this.bikesBehaviorSubject.next(bikes);
      console.log(`Bikes fetched: ${JSON.stringify(bikes.map(bikes=>bikes.bikeName))}`); // Log the fetched bikes  
    })
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

  return this.httpClient.post<Bike>(`${this.apiUrl}/bikes`, payload, { headers: { 'Content-Type': 'application/json' } } // Ensure the payload is sent as JSON
  ).pipe(
    tap(newBike => {
      const currentBikes = this.bikesBehaviorSubject.value;
      console.log(`New bike created: ${JSON.stringify(newBike)}`);
      this.bikesBehaviorSubject.next([...currentBikes, newBike]);
    })
  );
}

updateBike(id:string, name: string, price: number, type: string, description: string, image: string): Observable<Bike> {
  const payload = {
    _id: id, // Include the ID in the payload for update
    name,
    price,
    type,
    description,
    image,
    likes: 0 // default value
  };

  return this.httpClient.put<Bike>(`${this.apiUrl}/bikes/${id}`, payload, { headers: { 'Content-Type': 'application/json' } } // Ensure the payload is sent as JSON
  ).pipe(
    tap(updatedBike => {
      const currentBikes = this.bikesBehaviorSubject.value;
      console.log(`Bike updated: ${JSON.stringify(updatedBike)}`);
      this.bikesBehaviorSubject.next([...currentBikes, updatedBike]);
    })
  );
}

deleteBike(id: string): Observable<Bike> {
  return this.httpClient.delete<Bike>(`${this.apiUrl}/bikes/${id}`).pipe(
    tap(deleted => {
      const currentBikes = this.bikesBehaviorSubject.value;
      console.log(`Deleted bike: ${JSON.stringify(deleted)}`);
      this.bikesBehaviorSubject.next([...currentBikes, deleted]);
    })
  );
}

}

import { Injectable, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map, of } from 'rxjs';
import  { Bike } from '../../models/bike.model'; // Adjust the import path as necessary
import { BikeRes } from '../../models/bikeRes.model'; // Adjust the import path as necessary
import { forkJoin, throwError, catchError, switchMap } from 'rxjs';
import { AuthService } from './auth.service'; // Adjust the import path as necessary


@Injectable({
  providedIn: 'root'
})
export class BikesService implements OnInit {
  // private apiUrl = 'http://localhost:3030/jsonstore';
  private apiUrl = 'http://localhost:3030';
  private maxNumberOfBikes = 15; // Maximum number of bikes to be displayed
  private bikesBehaviorSubject = new BehaviorSubject<Bike[]>([]);
  private token = localStorage.getItem('token') || ''; // Retrieve the token from localStorage
  private authService = inject(AuthService); // Inject the AuthService

  public bikes$: Observable<Bike[]> = this.bikesBehaviorSubject.asObservable();
  public likedBikes$: Observable<Bike[]> = this.bikesBehaviorSubject.asObservable();

  constructor(private httpClient: HttpClient) {
    // Initialize the bikes$ observable with the current value of the BehaviorSubject
    this.getBikes().subscribe(data => console.log('Bikes DATA emitted:', data.map(bike => bike.bikeName))); // Log the bikes data when it is emitted
    
    this._createBikeCollection();
    
    this.bikesBehaviorSubject.pipe(
      tap(bikes => {
        console.log(`Bikes BehaviorSubject initialized with: ${bikes.length}`);
        if (bikes.length > this.maxNumberOfBikes) {
          this._deleteAllBikes().subscribe(data => {
            console.log('Bikes DATA will be deleted:', data);
          });
        }
      })
    ).subscribe();
     // Log the bikes data when it is deleted
  }
  ngOnInit(): void {
    this.getBikes().pipe(tap(bikes => {this.bikesBehaviorSubject.next(bikes)})).subscribe(data => console.log('Bikes DATA emitted:', data.map(bike => bike.bikeName))); // Log the bikes data when it is emitted
  }

 private _getBikes(): Observable<Bike[]> {
  return this.httpClient.get<BikeRes>(`${this.apiUrl}/jsonstore/bikes`).pipe(
    map(response =>
      Object.entries(response?.products ?? {}).map(([uuid, bikeData]) => ({
        id: uuid,
        bikeName: bikeData.name,
        price: bikeData.price,
        type: bikeData.type,
        description: bikeData.description,
        image: bikeData.image,
        likes: bikeData.likes
      }))
    ),
    tap(bikes => {//this.bikesBehaviorSubject.next(bikes);
      console.log(`_Bikes fetched: ${JSON.stringify(bikes.map(bikes=>bikes.bikeName))}`); // Log the fetched bikes  
    })
  );
}

private _createBikeCollection(): void {   
// Step 1: Get existing bikes from target collection 
// Step 2: Get bikes from source collection
    this.getBikes().pipe(
      catchError(err => {
        if (err.status === 404) {
          console.warn('Main collection not found. Falling back to store...');
          return of(null); // Treat as empty
        }
        console.error('Error fetching main collection:', err);
        return throwError(() => err);
      }),
      switchMap(existingBikes => {
        if (!existingBikes || existingBikes.length === 0) {
          return this._getBikes().pipe(
            switchMap(sourceBikes => {
              const createRequests = sourceBikes.map(bike =>
                this.createBike(
                  bike.bikeName,
                  bike.price,
                  bike.type,
                  bike.description,
                  bike.image
                ).pipe(
                  catchError(err => {
                    console.error('Error creating bike:', err);
                    return of(null);
                  })
                )
              );
              return createRequests.length > 0 ? forkJoin(createRequests) : of([]);
            })
          );
        } else {
          console.log('Main collection already has bikes. Skipping migration.');
          return of([]);
        }
      }),
      tap(createdBikes => {
        const successfulCreations = createdBikes.filter(b => b !== null);
        if (successfulCreations.length > 0) {
          console.log(`Successfully migrated ${successfulCreations.length} bikes.`);
        }
      }),
      catchError(err => {
        console.error('Migration failed:', err);
        return of([]);
      })
    ).subscribe();

}

 getBikes(): Observable<Bike[]> {
  // Fetch bikes from the API and update the BehaviorSubject 
  return this.httpClient.get<any[]>(`${this.apiUrl}/data/bikes`).pipe(
    map(response =>
      response.map(bike => ({
        id: bike._id,
        bikeName: bike.name,
        price: bike.price,
        type: bike.type,
        description: bike.description,
        image: bike.image,
        likes: bike.likes,
        _ownerId: bike._ownerId,
        _createdOn: bike._createdOn
      }))
    ),
    tap(bikes => this.bikesBehaviorSubject.next(bikes))
  );

 }


getBikeById(id?: string): Observable<Bike> {
  return this.httpClient.get<Bike>(`${this.apiUrl}/data/bikes/${id}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).pipe(
    tap(bike => console.log(`Fetched bike by ID ${id}:`, bike))
  );
}


createBike(name: string, price: number, type: string, description: string, image: string): Observable<Bike> {
  const payload = {
    name,
    price,
    type,
    description,
    image,
    likes: 0 // default value if likes is not provided
  };

  return this.httpClient.post<Bike>(`${this.apiUrl}/data/bikes`, payload, { headers: { 'Content-Type': 'application/json' } } // Ensure the payload is sent as JSON
  ).pipe(
    tap(newBike => {
      const currentBikes = this.bikesBehaviorSubject.value;
      console.log(`New bike created: ${JSON.stringify(newBike)}`);
      this.bikesBehaviorSubject.next([...currentBikes, newBike]);
    })
  );
}

updateBike(id:string, payload:Partial<Bike>): Observable<Bike> { //name?: string, price?: number, type?: string, description?: string, image?: string, likes?: number
 
  return this.httpClient.patch<Bike>(`${this.apiUrl}/data/bikes/${id}`, payload, { headers: { 'Content-Type': 'application/json' } } // Ensure the payload is sent as JSON
  ).pipe(
    tap((updatedBike) => {
      const currentBikes = this.bikesBehaviorSubject.value;   
      const updatedBikes = currentBikes.map(bike =>
      bike.id === id ? updatedBike : bike);
      console.log(`Bike updated: ${JSON.stringify(updatedBike)}`);
      this.bikesBehaviorSubject.next([...updatedBikes]);
    })
  );
}

deleteBike(id: string): Observable<void> {
  
return this.httpClient.delete<void>(`${this.apiUrl}/data/bikes/${id}`, {
  headers: { 'X-Authorization': this.token }
}).pipe(
  tap(() => {
    const currentBikes = this.bikesBehaviorSubject.value;
    const updatedBikes = currentBikes.filter(bike => bike.id !== id);
    console.log(`Deleted bike with ID: ${id}`);
    this.bikesBehaviorSubject.next(updatedBikes);
  }),
  catchError(error => {
    console.error('Delete failed:', error);
    return throwError(() => error);
  })
);

}
  
private _deleteAllBikes(): Observable<void> {
  // Fetch all bikes and filter for the current user's bikes  
    const currentUserId = this.authService.currentUser()?.id;

    return this.getBikes().pipe(
      tap(bikes => console.log('Fetched bikes:', bikes)),
      map(bikes => bikes.filter(bike => bike._ownerId === currentUserId)),
      tap(userBikes => console.log('User bikes to delete:', userBikes)),
      switchMap(userBikes => {
        const deleteRequests = userBikes.map(bike => this.deleteBike(bike.id));
        return deleteRequests.length > 0 ? forkJoin(deleteRequests) : of([]);
      }),
      tap(() => {
        console.log('All user-owned bikes deleted');
        // Optionally refresh the bikes list
        this.getBikes().subscribe();
      }),
      map(() => void 0)
    );

  }

}

import { BikeItem } from '../bike-item/bike-item';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map, pipe } from 'rxjs';
import { Bike } from '../../../models';
import { BikesService } from '../../../core/services/bikes.service';
import { SliceTitlePipe } from '../../../shared/pipes';

@Component({
  selector: 'app-bike-most-popular',
  imports: [CommonModule, SliceTitlePipe],
  templateUrl: './bike-most-popular.html',
  styleUrl: './bike-most-popular.css'
})
export class BikeMostPopular {
  private authService = inject(AuthService);
  readonly isLoggedIn = this.authService.isLoggedIn;
  readonly currentUser = this.authService.currentUser;
  liked$: Observable<Bike[]>;
  bikes$: Observable<Bike[]>;
  likedBikes$: Observable<Bike[]>;

constructor(
  private bikeService: BikesService) {
    
  this.bikes$ = this.bikeService.bikes$;
  this.likedBikes$ = this.bikeService.likedBikes$;
  
  this.liked$=this.getMostPopularBikesLimit(3);
  this.likedBikes$.subscribe(data => console.log('Bikes DATA emitted:', data.map(bike => bike.bikeName))); // Log the bikes data when it is emitted

  }

// Slice the first 'limit' items
  getMostPopularBikesLimit(limit: number): Observable<Bike[]> { 
    return this.likedBikes$.pipe(
      map(bikes => bikes.slice(0, limit)) 
    )
  }

}

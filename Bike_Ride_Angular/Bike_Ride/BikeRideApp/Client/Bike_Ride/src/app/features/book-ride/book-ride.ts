import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map, tap } from 'rxjs';
import { Bike } from '../../models/bike.model';
import { BikesService } from '../../core/services/bikes.service';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { BikeContent } from '../bikesCs/bike-content/bike-content';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-book-ride',
  imports: [CommonModule, RouterLink],
  templateUrl: './book-ride.html',
  styleUrl: './book-ride.css'
})
export class BookRide {
  private authService = inject(AuthService);
  readonly isLoggedIn = this.authService.isLoggedIn;
  readonly currentUser = this.authService.currentUser;
  private route = inject(ActivatedRoute);
  public isAvailable: boolean = false; // Flag to check if the bike is available
    
  bookedBikes$: Observable<Bike[]>;


  constructor( private bikeService: BikesService) {
    
    this.bookedBikes$ = this.bikeService.bikes$.pipe(
      map(bikes => bikes.filter(bike => bike.booked)),
      tap(bookedBikes => {
        this.isAvailable = bookedBikes.length > 1;
        console.log(`isAvailable set to: ${this.isAvailable}`);
      })
    );

  }

  converImageUrl(imageUrl:string): string | null {
    let newURL = imageUrl.replace(/^\/?/, '');
    console.log(`BikeContent: Converted image URL: ${newURL}`);
    return newURL;
  }

  onRemove(bikeId: string): void {}
}

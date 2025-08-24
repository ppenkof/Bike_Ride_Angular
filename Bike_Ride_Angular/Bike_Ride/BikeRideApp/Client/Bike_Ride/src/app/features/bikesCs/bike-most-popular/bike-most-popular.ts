import { LikeService } from '../../../core/services/like.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, pipe,tap, combineLatest, of } from 'rxjs';
import { Bike } from '../../../models';
import { BikesService } from '../../../core/services/bikes.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SliceTitlePipe } from '../../../shared/pipes';

@Component({
  selector: 'app-bike-most-popular',
  imports: [CommonModule, SliceTitlePipe],
  templateUrl: './bike-most-popular.html',
  styleUrl: './bike-most-popular.css'
})
export class BikeMostPopular implements OnInit{
  private authService = inject(AuthService);
  private likeService = inject(LikeService);
  
  readonly isLoggedIn = this.authService.isLoggedIn;
  readonly currentUser = this.authService.currentUser;
  // liked$: Observable<Bike[]>;
  bikes$: Observable<Bike[]>;
  
constructor(
  private bikeService: BikesService) {
  this.bikes$ = this.bikeService.bikes$;
  this.bikes$.subscribe(data => console.log('Bikes DATA emitted:', data.map(bike => bike.bikeName))); // Log the bikes data when it is emitted
  this.bikes$=this.getMostPopularBikesLimit(3);
  }

  ngOnInit(): void {
    //this.likeService.getCount().subscribe(); 
  }
  
    
    getLikeCount(bikeId: string): number {
      return this.likeService.likeCounts()[bikeId] || 0;
    }

  // Slice the first 'limit' items
  getMostPopularBikesLimit(limit: number): Observable<Bike[]> {      
    return this.bikeService.bikes$.pipe(
      switchMap(bikes => {
        const likeCounts$ = bikes.map(bike =>
          this.likeService.getCount(bike.id).pipe(
            catchError(error => {
              console.error(`Error fetching like count for bike ${bike.id}:`, error);
              return of(0); // fallback to 0 likes
            })
          )
        );

        return combineLatest(likeCounts$).pipe(
          map(counts => {
            return bikes
              .map((bike, i) => ({ bike, likeCount: counts[i] }))
              .sort((a, b) => b.likeCount - a.likeCount)
              .slice(0, limit)
              .map(entry => entry.bike);
          })
        );
      }),
      catchError(error => {
        console.error('getMostPopularBikesLimit -> Unexpected error:', error);
        return of([]); // fallback to empty list if something goes wrong
      })
    );

    }
    
}

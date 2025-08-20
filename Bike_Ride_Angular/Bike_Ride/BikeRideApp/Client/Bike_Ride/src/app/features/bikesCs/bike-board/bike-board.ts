import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, combineLatest, map } from 'rxjs';
import { Bike } from '../../../models';
import { BikesService } from '../../../core/services/bikes.service';
import { BikeItem } from '../bike-item/bike-item';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { BikeContent } from '../bike-content/bike-content';


@Component({
  selector: 'app-bike-board',
  imports: [CommonModule, BikeItem, RouterLink],
  templateUrl: './bike-board.html',
  styleUrl: './bike-board.css'
})
export class BikeBoard  {
  private authService = inject(AuthService);
  readonly isLoggedIn = this.authService.isLoggedIn;
  readonly currentUser = this.authService.currentUser;

  bikes$: Observable<Bike[]>;

constructor(
  private bikeService: BikesService) {
    
  this.bikes$ = this.bikeService.bikes$;

  this.bikeService.getBikes().subscribe(data => console.log('Bikes DATA emitted:', data));
  }

}


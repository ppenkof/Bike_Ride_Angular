import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Bike } from '../../../models';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink, Router } from '@angular/router';
import { BikesService } from '../../../core/services/bikes.service';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { BikeBoard } from '../bike-board/bike-board';
import { BikeItem } from '../bike-item/bike-item';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-bike-content',
  imports: [CommonModule, RouterLink, BikeItem, BikeBoard],
  templateUrl: './bike-content.html',
  styleUrl: './bike-content.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BikeContent {

  @Input() bike!: Bike;

  private authService = inject(AuthService);
  private bikeService = inject(BikesService);
  private routes = inject(Router);
  private route = inject(ActivatedRoute);

  bikes$: Observable<Bike[]>;
  
  constructor() {
    this.bikes$=this.bikeService.bikes$;
    let targetBikeId = this.route.snapshot.paramMap.getAll('id')[0]; // Get the bike ID from the route parameters
    targetBikeId = targetBikeId.replace(':',''); // Ensure the ID is a string 
      console.error(`BikeContent: bike ID provided in route parameters: ${targetBikeId}`);
      
    this.bikeService.bikes$.pipe(
      map(bikes => bikes.find(bike => bike.id === targetBikeId)),
      tap(bike => {
        if (bike) {
          this.bike = bike;
          console.log('Bike found in bikes$:', bike);
        } else {
          console.warn('Bike not found in bikes$');
        }
      })
    ).subscribe();

}


   get isLoggedIn(): boolean {
    console.log('BikeContent: Checking if user is logged in:', this.authService.isLoggedIn());
    return this.authService.isLoggedIn();
  }

  get currentUserId(): string | null {
    console.log('BikeContent: Fetching current user ID:', this.authService.getCurrentUserId());
    return this.authService.getCurrentUserId();
  }

  get isAdmin(): boolean {
    console.log('BikeContent: Checking if user is admin:', this.authService.isAdmin());
    return this.authService.isAdmin();
  }

  converImageUrl(imageUrl:string): string | null {
    let newURL = imageUrl.replace(/^\/?/, '');
    console.log(`BikeContent: Converted image URL: ${newURL}`);
    return newURL;
  }

   // You'd check against user's subscriptions
  onEdit(bikeId: string): void {
    this.routes.navigate([`/edit-bike/:${this.bike.id}`]); // Navigate to the bike edit page
  }

// For now, you just would make an API call
  onDelete(bikeId: string): void {
    this.bikeService.deleteBike(bikeId).subscribe({
      next:() =>{
        this.routes.navigate(['/bikes']); // Navigate to the bike board after deletion
      },
    error:(err)=>{
        console.error('Error deleting bike:', err);
      }
    });                                                      
  }

onLike(bikeId: string): void {
  this.bikeService.updateBike(bikeId,{likes:1}).subscribe({
    next: () => {
      this.routes.navigate(['/bikes']); // Navigate to the bike board after deletion
      console.log(`Bike with ID ${bikeId} liked successfully.`);
    },
    error: (err) => {
      console.error('Error liking bike:', err);
    }
  });
}

}

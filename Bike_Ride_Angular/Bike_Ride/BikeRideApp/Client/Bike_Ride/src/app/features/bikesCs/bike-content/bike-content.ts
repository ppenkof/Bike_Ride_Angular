import { ChangeDetectionStrategy, Component, inject, Input, OnInit, signal } from '@angular/core';
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
import { LikeService } from '../../../core/services/like.service';
import { BehaviorSubject, of } from 'rxjs';
import { Like } from '../../../models';
import { BikeMostPopular } from '../bike-most-popular/bike-most-popular';


@Component({
  selector: 'app-bike-content',
  imports: [CommonModule, RouterLink],
  templateUrl: './bike-content.html',
  styleUrl: './bike-content.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BikeContent implements OnInit{

  @Input() bike!: Bike;

  private authService = inject(AuthService);
  private bikeService = inject(BikesService);
  private routes = inject(Router);
  private route = inject(ActivatedRoute);
  private likeService = inject(LikeService);
  private bikeId: string;
  private userId: string |  null;
  public  hasLiked: boolean = false;

  bikes$: Observable<Bike[]>;

  constructor() {

    this.userId=this.authService.getCurrentUserId();
    this.bikes$=this.bikeService.bikes$;
    let targetBikeId = this.route.snapshot.paramMap.getAll('id')[0]; // Get the bike ID from the route parameters
    targetBikeId = targetBikeId.replace(':',''); // Ensure the ID is a string 
    this.bikeId = targetBikeId;
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
    
    this.likeService.getCount(this.bikeId).subscribe();
    this.likeService.getUserLike(this.bikeId,this.userId).subscribe(userLike => {this.hasLiked = !!userLike; console.log(`User has alredy liked this: ${this.hasLiked}`);
    });
}

ngOnInit(): void {
  this.likeService.getCount(this.bikeId).subscribe();
  this.likeService.getUserLike(this.bikeId,this.userId).subscribe(userLike => {this.hasLiked = !!userLike; console.log(`User has alredy liked this: ${this.hasLiked}`);
  });
}

  
  getLikeCount(bikeId: string): number {
    return this.likeService.likeCounts()[bikeId] || 0;
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
      if(!this.hasLiked){
        this.likeService.like(bikeId).subscribe({
          next: (like) => {
            this.routes.navigate(['/bikes']);
            console.log('BikeContent: Like successful:', like);
          },
          error: (err) => {
            console.error('BikeContent: Error liking bike:', err);
          }
        });
      }
    }


}

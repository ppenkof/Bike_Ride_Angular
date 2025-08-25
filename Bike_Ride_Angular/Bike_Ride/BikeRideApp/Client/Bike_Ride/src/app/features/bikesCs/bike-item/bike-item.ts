import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { Bike } from '../../../models';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { SliceTitlePipe } from '../../../shared/pipes/slice-title.pipe';
import { ActivatedRoute } from '@angular/router';
import { BikesService } from '../../../core/services/bikes.service'; // Import the BikesService
import { LikeService } from '../../../core/services/like.service';
import { BookService } from '../../../core/services/book.service';


@Component({
  selector: 'app-bike-item',
  imports: [CommonModule, RouterLink],
  providers: [SliceTitlePipe],
  templateUrl: './bike-item.html',
  styleUrl: './bike-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BikeItem implements OnInit{
  @Input() bike!: Bike;

  private authService = inject(AuthService);
  private sliceTitle = inject(SliceTitlePipe);
  private bikeService = inject(BikesService); // Inject the BikesService
  private likeService = inject(LikeService);
  private bookService = inject(BookService);
  private router = inject(Router);

  public  hasBooked: boolean = false;

  ngOnInit(): void {
    this.authService.isAdmin;
    this.likeService.getCount(this.bike.id).subscribe(); 
    this.bookService.getCount(this.bike.id).subscribe();
    this.bookService.getUserBooks(this.currentUserId, this.bike.id).subscribe(userBook => {this.hasBooked = !!userBook; console.log(`User has alredy liked this: ${this.hasBooked}`);
    });
  }
  
  bookRide( id:string): void {
    // if(!this.hasBooked){
      this.bookService.book(id).subscribe({
        next: (book) => {
          this.router.navigate(['/bikes']);
          console.log('BikeItem: Book successful:', book);
        },
        error: (err) => {
          console.error('BikeItem: Error booking bike:', err);
        }
      });
    //}
  }
    
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get currentUserId(): string | null {
    return this.authService.getCurrentUserId();
  }

  getLikeCount(bikeId: string): number {
    return this.likeService.likeCounts()[bikeId] || 0;
  }

  getIsAdmin(){
    console.log(`This user is admin or ${this.authService.isAdmin}`);
    return this.authService.isAdmin;
  }

  truncateDescription(isTruncate: boolean): string {
    const truncated = this.sliceTitle.transform(this.bike.description, 50, isTruncate);
    return truncated;
  }

  converImageUrl(imageUrl:string): string | null {
    let newURL = imageUrl.replace(/^\/?/, '');
    console.log(`Converted image URL: ${newURL}`);
    return newURL;
  }

}

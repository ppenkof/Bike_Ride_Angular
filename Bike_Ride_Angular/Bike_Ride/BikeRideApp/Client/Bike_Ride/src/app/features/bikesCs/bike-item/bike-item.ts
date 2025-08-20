import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { Bike } from '../../../models';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { SliceTitlePipe } from '../../../shared/pipes/slice-title.pipe';
import { BikeContent } from '../bike-content/bike-content';
import { BikesService } from '../../../core/services/bikes.service'; // Import the BikesService


@Component({
  selector: 'app-bike-item',
  imports: [CommonModule, RouterLink],
  providers: [SliceTitlePipe],
  templateUrl: './bike-item.html',
  styleUrl: './bike-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BikeItem {
  @Input() bike!: Bike;

  private authService = inject(AuthService);
  private sliceTitle = inject(SliceTitlePipe);
  private bikeService = inject(BikesService); // Inject the BikesService

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get currentUserId(): string | null {
    return this.authService.getCurrentUserId();
  }

  bookRide( id:string): void {
    this.bikeService.updateBike(id, { booked: true }).subscribe({
      next: (updatedBike) => {
        console.log('Bike booked successfully:', updatedBike);
      },
      error: (error) => {
        console.error('Error booking bike:', error);
      }
    })
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

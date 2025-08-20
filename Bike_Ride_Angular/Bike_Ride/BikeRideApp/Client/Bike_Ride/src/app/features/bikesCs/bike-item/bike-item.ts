import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { Bike } from '../../../models';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { SliceTitlePipe } from '../../../shared/pipes/slice-title.pipe';
import { BikeContent } from '../bike-content/bike-content';


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

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get currentUserId(): string | null {
    return this.authService.getCurrentUserId();
  }

  isSubscribed(bikeId: string): boolean {
    // For now, return false. In a real app, you'd check against user's subscriptions
    return false;
  }

  toggleSubscribe(bikeId: string): void {
    // For now, just log the action. In a real app, you'd make an API call
    console.log(`Toggling subscription for bike: ${bikeId}`);
    
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

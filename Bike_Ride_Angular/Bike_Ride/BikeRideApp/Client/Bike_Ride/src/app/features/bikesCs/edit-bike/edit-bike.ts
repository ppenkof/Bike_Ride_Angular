import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BikesService } from '../../../core/services/bikes.service';
import { Observable } from 'rxjs';
import { Bike } from '../../../models/bike.model';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-edit-bike',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './edit-bike.html',
  styleUrl: './edit-bike.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditBike {

  private authService = inject(AuthService);
  private bikeService = inject(BikesService);
  private route = inject(ActivatedRoute);

  private router = inject(Router);
  private bikesService = inject(BikesService);

  @Input() bike!: Bike;

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
          
          // Autofill fields here
          this.bikeName = bike.bikeName;
          this.descriptionText = bike.description;
          this.testPrice = bike.price;
          this.bikeType = bike.type;
          this.imageUrl = bike.image;

        } else {
          console.warn('Bike not found in bikes$');
        }
      })
    ).subscribe();

  }

  bikeName = '';
  bikeNameError = false;
  bikeNameErrorMessage = '';
  descriptionError = false;
  descriptionText = ''; 
  descriptionErrorMessage = '';
  testPrice = 0;
  tesPriceError = false;
  testPriceErrorMessage = '';
  bikeType = '';
  bikeTypeError = false;
  bikeTypeErrorMessage = '';
  imageUrl = this.bike?.image;
  imageError = false;
  imageErrorMessage = '';

  // name,
  // price,
  // type,
  // description,
  // image: imageUrl,

  validateName(): void {
    if (!this.bikeName) {
      this.bikeNameError = true;
      this.bikeNameErrorMessage = 'Bike name is required.';
    } else if (this.bikeName.length < 3) {
      this.bikeNameError = true;
      this.bikeNameErrorMessage = 'Bike name must be at least 5 characters long.';
    } else {
      this.bikeNameError = false;
      this.bikeNameErrorMessage = '';
    }
  }

  validateDescription(): void {
    if (!this.descriptionText) {
      this.descriptionError = true;
      this.descriptionErrorMessage = 'The field with your post is required.';
    } else if (this.descriptionText.length < 50) {
      this.descriptionError = true;
      this.descriptionErrorMessage = 'Description must be at least 50 characters long.';
    } else {
      this.descriptionError = false;
      this.descriptionErrorMessage = '';
    }
  }

  validatePrice(): void {
    if (this.testPrice <= 0) {
      this.tesPriceError = true;
      this.testPriceErrorMessage = 'Price must be greater than zero.';
      this.testPrice = 0;
    } else {
      this.testPriceErrorMessage = '';
    }
  }

  validateType(): void {
    if (!this.bikeType) {
      this.bikeTypeError = true;
      this.bikeTypeErrorMessage = 'Bike type is required.';
    } else if (this.descriptionText.length < 3) {
      this.bikeTypeError = true;
      this.bikeTypeErrorMessage = 'Bike type must be at least 3 characters long.';
    } else {
      this.bikeTypeError = false;
      this.bikeTypeErrorMessage = '';
    }
  }

  validateImage(): void {
    if (!this.imageUrl) {
      this.imageError = true;
      this.imageErrorMessage = 'Image URL is required.';
    } else if (!this.imageUrl.startsWith('bikes_info/')) {
      this.imageError = true;
      this.imageErrorMessage = 'Image URL must start with bikes_info/';
    } else {
      this.imageError = false;
      this.imageErrorMessage = '';
    }
  }

  isFormValid(): boolean {
    return  Boolean(this.bikeName) &&!this.bikeNameError && !this.bikeNameErrorMessage && Boolean(this.descriptionText) && !this.descriptionError && !this.descriptionErrorMessage &&
            Boolean(this.bikeType) && !this.bikeTypeError && !this.bikeTypeErrorMessage  && this.testPrice > 0 && !this.tesPriceError && !this.testPriceErrorMessage && 
            Boolean(this.imageUrl) && !this.imageError && !this.imageErrorMessage; 
  }

  onCancel(): void {
    this.router.navigate(['/bikes']);
  }

  onSubmit(): void {
    this.validateName();
    this.validateDescription();
    this.validatePrice();
    this.validateType();
    this.validateImage();


    // this.profileForm.patchValue({
    //   username: user?.username,
    //   email: user?.email,
    //   phone: user?.phone
    // })
    // this.isEditMode = true;

    if (this.isFormValid()) {
      this.bikesService.updateBike(this.bike.id, {bikeName: this.bikeName, price: this.testPrice, type: this.bikeType, description: this.descriptionText, image: this.imageUrl})
        .subscribe({
          next: () => {
            this.router.navigate(['/bikes'])//this.router.navigate(['/bikes'])
          },
          error: (err) => {
            console.log('New bike failed', err);
          }
        });
    }
  }
}

import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BikesService } from '../../../core/services/bikes.service';

@Component({
  selector: 'app-new-bike',
  imports: [FormsModule],
  templateUrl: './new-bike.html',
  styleUrl: './new-bike.css'
})
export class NewBike {
  private router = inject(Router);
  private bikesService = inject(BikesService);

  bikeName = '';
  bikeNameError = false;
  bikeNameErrorMessage = '';
  descriptionError = false;
  descriptionText = '';
  descriptionErrorMessage = '';
  testPrice = 0;
  tesPriceError = '';
  testPriceErrorMessage = '';
  bikeType = '';
  bikeTypeError = false;
  bikeTypeErrorMessage = '';
  imageUrl = '';
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
    } else if (!this.imageUrl.startsWith('bike_info/')) {
      this.imageError = true;
      this.imageErrorMessage = 'Image URL must start with bike_info/.';
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
    this.router.navigate(['/home']);
  }

  onSubmit(): void {
    this.validateName();
    this.validateDescription();

    if (this.isFormValid()) {
      this.bikesService.createBike(this.bikeName, this.testPrice, this.bikeType, this.descriptionText, this.imageUrl)
        .subscribe({
          next: () => {
            this.router.navigate(['/bikes'])
          },
          error: (err) => {
            console.log('New bike failed', err);
          }
        });
    }
  }
}

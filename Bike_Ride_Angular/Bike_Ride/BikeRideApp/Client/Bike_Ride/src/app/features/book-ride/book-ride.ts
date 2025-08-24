import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map, tap, switchMap, forkJoin, combineLatest } from 'rxjs';
import { Bike } from '../../models/bike.model';
import { BikesService } from '../../core/services/bikes.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { BikeContent } from '../bikesCs/bike-content/bike-content';
import { BookService } from '../../core/services/book.service';
import { AbstractControl, FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Book } from '../../models';


@Component({
  selector: 'app-book-ride',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './book-ride.html',
  styleUrl: './book-ride.css'
})
export class BookRide implements OnInit{
  private authService = inject(AuthService);
  private bikeService = inject(BikesService);
  private bookService = inject(BookService)
  readonly isLoggedIn = this.authService.isLoggedIn;
  readonly currentUser = this.authService.currentUser;
  private router = inject(Router);
  private userId: string |  null;
  public isAvailable: boolean = true; // Flag to check if the bike is available
  public bookings: Book[] = [];
  public bikes: Bike[] = [];

  //private formBuilder = inject(FormBuilder);

  // loginForm: FormGroup;

    
  bookedBikes$: Observable<Bike[]>;
  bikes$: Observable<Bike[]>;
  

  constructor() {
    this.userId=this.authService.getCurrentUserId();
    this.bikes$ = this.bikeService.bikes$;
    this.bikes$.pipe(tap(bikes => console.log('Bikes from service:', bikes))).subscribe();
    
    this.bookService.getAllBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        console.log(`Books from server:`, JSON.stringify(bookings));
        
      },
      error: (err) => {
        console.error('Error fetching bookings:', err);
      }
    });

    this.bookedBikes$ = combineLatest([
      this.bikeService.bikes$,
      this.bookService.getAllBookings()
    ]).pipe(
      tap(([bikes, bookings]) => {
        console.log('All bookings:', bookings);
        console.log('Current user ID:', this.userId);
      }),
      map(([bikes = [], bookings]) => {
        let userBookings = bookings.filter(book => {book._ownerId !== this.userId;console.log(`Book _ownerId is: ${book._ownerId} and userId is: ${this.userId} and userBookings!!!`);
        });
        const bookedBikeIds = userBookings.map(book => book.bikeId);console.log(`userBookings is: `,JSON.stringify(userBookings));
        const bookedBikes = bikes.filter(bike => bookedBikeIds.includes(bike.id));
        this.isAvailable = bookedBikes.length > 0;
        console.log(`isAvailable is: ${this.isAvailable} and ${bookedBikes.length}`);
        
        return bookedBikes;
      })
    );
    
  }
  ngOnInit(): void {
    this.bookedBikes$ = combineLatest([
      this.bikeService.bikes$,
      this.bookService.getAllBookings()
    ]).pipe(
      tap(([bikes, bookings]) => {
        console.log('All bookings:', bookings);
        console.log('Current user ID:', this.userId);
      }),
      map(([bikes = [], bookings]) => {
        let userBookings = bookings.filter(book => {book._ownerId !== this.userId;console.log(`Book _ownerId is: ${book._ownerId} and userId is: ${this.userId} and userBookings!!!`);
        });
        const bookedBikeIds = userBookings.map(book => book.bikeId);console.log(`userBookings is: `,JSON.stringify(userBookings));
        const bookedBikes = bikes.filter(bike => bookedBikeIds.includes(bike.id));
        this.isAvailable = bookedBikes.length > 0;
        console.log(`isAvailable is: ${this.isAvailable} and ${bookedBikes.length}`);
        
        return bookedBikes;
      })
    );
    
  }
  //************************************** */
 
  //   this.loginForm = this.formBuilder.group({
  //       hour: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):(00|30)$/)]],      
  //       date: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}\/\d{4}$/)]]// DD/MM/YYYY
  //   });
  // }
     
  //   get hour(): AbstractControl<any, any> | null {
  //     return this.loginForm.get('hour');
  //   }
  
  //   get date(): AbstractControl<any, any> | null {
  //     return this.loginForm.get('date');
  //   }
  
  //   get isHourValid(): boolean {
  //     return this.hour?.invalid && (this.hour?.dirty || this.hour?.touched) || false;
  //   }
  
  //   get isDateValid(): boolean {
  //     return this.date?.invalid && (this.date?.dirty || this.date?.touched) || false;
  //   }
  
  //   get hourErrorMessage(): string {
  //     if (this.hour?.errors?.['required']) {
  //       return 'Hour is required!';
  //     }
  
  //     if (this.hour?.errors?.['pattern']) {
  //       return 'Hour is not valid! Hour must finish to :00 or :30';
  //     }
  
  //     return '';
  //   }
  
  //   get DateErrorMessage(): string {
  //     if (this.date?.errors?.['required']) {
  //       return 'Date is required!';
  //     }
  
  //     if (this.date?.errors?.['minlength']) {
  //       return 'Date must be correct DD/MM/YYYY!';
  //     }
  
  //     return '';
  //   }
  //*************************************** */

    
  formatDate(timestamp: string): string {
    return new Date(Number(timestamp)).toLocaleDateString();
  }


  converImageUrl(imageUrl:string): string | null {
    let newURL = imageUrl.replace(/^\/?/, '');
    console.log(`BikeContent: Converted image URL: ${newURL}`);
    return newURL;
  }

  onRemove(bikeId: string): void {
    this.bookService.unbook(bikeId, ).subscribe({
        next: (book) => {
          this.router.navigate(['/bikes']);
          console.log('BikeRide: Remove successful:', book);
        },
        error: (err) => {
          console.error('BikeRide: Error removing bike:', err);
        }
      });

      this.bookService.getCount(bikeId).subscribe();
    }
  
  
}  

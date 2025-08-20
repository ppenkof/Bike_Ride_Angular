import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { BikeContent } from '../bikesCs';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
private authService = inject(AuthService);
readonly isLoggedIn = this.authService.isLoggedIn;
readonly currentUser = this.authService.currentUser;

}
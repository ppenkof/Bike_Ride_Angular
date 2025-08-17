import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  protected authService = inject(AuthService);
  private router = inject(Router);
  //banner img not render
  correctUrl=this.authService.converImageUrl;
  image='assets/download.jpg';

  readonly isLoggedIn = this.authService.isLoggedIn;
  readonly currentUser = this.authService.currentUser;
  readonly isAdmin = this.authService.isAdmin;

  // ngOnInit(): void {
  //   console.log(`Header component initialized. User logged in: ${this.isLoggedIn()}, ${this.currentUser()}, isAdmin: ${this.isAdmin()}`);
  // }

  logout(): void {
    console.log(`Logout check ${this.authService.isLoggedIn}`)
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/home']);
        console.log(`Logout successful ${this.isLoggedIn}`);
      },
      error: (err) => {
        if(err.status === 401 || err.status === 404){
            localStorage.removeItem('currentUser');
            localStorage.removeItem('token'); 
        }
        console.log('Logout failed', err);
        this.router.navigate(['/login']);
        
      }
    });
  }
}

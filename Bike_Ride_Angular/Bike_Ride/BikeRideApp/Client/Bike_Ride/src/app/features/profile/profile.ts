import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../models/user.model';
import { RouterLink, Router, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {


  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  readonly currentUser = this.authService.currentUser;
  private router = inject(Router);

  isEditMode: boolean = false;
  profileForm: FormGroup;

  constructor() {
    this.profileForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.pattern(/^(?=.{6,})[a-zA-Z][a-zA-Z0-9._-]*@[a-zA-Z]{3}\.(com|bg)$/)]],
      phone: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/[0-9]*/)]],
    })
  }

  get username(): AbstractControl<any, any> | null {
    return this.profileForm.get('username');
  }

  get email(): AbstractControl<any, any> | null {
    return this.profileForm.get('email');
  }

  get phone(): AbstractControl<any, any> | null {
    return this.profileForm.get('phone');
  }

  get isUsernameValid(): boolean {
    return this.username?.invalid && (this.username?.dirty || this.username?.touched) || false;
  }

  get isEmailValid(): boolean {
    return this.email?.invalid && (this.email?.dirty || this.email?.touched) || false;
  }

  get usernameErrorMessage(): string {
    if (this.username?.errors?.['required']) {
      return 'Username is required!';
    }

    if (this.username?.errors?.['minlength']) {
      return 'Username should have at least 5 characters!';
    }

    return '';
  }

  get emailErrorMessage(): string {
    if (this.email?.errors?.['required']) {
      return 'Email is required!';
    }

    if (this.email?.errors?.['pattern']) {
      return 'Email is not valid!';
    }

    return '';
  }

  onEdit(): void {
    const user = this.currentUser();
    console.log(`Current user onEDIT: ${JSON.stringify(user)}`); // Debugging log to check current user
    
    // this.router.navigate(['/profile']);
    if (!user?.id) {
      console.error('No user found to edit.');
    }
    this.profileForm.patchValue({
      username: user?.username,
      email: user?.email,
      phone: user?.phone
    })
    this.isEditMode = true;
    // this.router.navigate(['/profile', user?.id]);
  }

  onCancel(): void {
    this.isEditMode = false;
    this.profileForm.reset();
  }

  onSave(): void {
    
      if (this.profileForm.valid) {
      const { username, email, phone } = this.profileForm.value
      const user = <User>{
        id: this.currentUser()?.id, // Use current user ID if not provided
        username: username,
        email: email,
        phone: phone
      };
      this.authService.update(user).subscribe({
        next: () => {
          this.router.navigate(['/home']);
          console.log('Update successful');
        },
        error: (err) => {
          console.log('Update failed', err);
        }
      });
  
      this.isEditMode = false;
      this.profileForm.reset();
      // this.router.navigate(['/profile', this.currentUser()?.id]);
      this.authService.logout().subscribe(()=> {console.log('Successfully logged out after profile update')});
    }
  }
}

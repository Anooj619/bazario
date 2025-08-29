import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  username: string = ''; // only for signup
  isSignup: boolean = false; // toggle mode
  showPassword: boolean = false; // 👁️ toggle state
  errorMessage: string = ''; // inline error message
  successMessage: string = ''; // ✅ inline success banner

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    const loginData = { email: this.email, password: this.password };

    this.authService.login(loginData).subscribe({
      next: (res: any) => {
        console.log('✅ Login success:', res);
        this.errorMessage = ''; // clear errors
        this.successMessage = ''; // clear banner
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        console.error('❌ Login failed:', err);
        this.errorMessage = 'Invalid Email ID or Password';
      }
    });
  }

  signup() {
    const signupData = { username: this.username, email: this.email, password: this.password };

    this.authService.register(signupData).subscribe({
      next: (res: any) => {
        console.log('✅ Signup success:', res);
        this.errorMessage = ''; // clear inline error
        this.successMessage = '🎉 Account created successfully! Please login to continue.'; // ✅ show banner
        this.isSignup = false; // switch back to login mode
        this.email = '';
        this.password = '';
        this.username = '';
      },
      error: (err: any) => {
        console.error('❌ Signup failed:', err);
        this.errorMessage = err.error?.message || 'Signup failed';
      }
    });
  }

  toggleMode() {
    this.isSignup = !this.isSignup;
    this.errorMessage = '';
    this.successMessage = '';
  }

  navigateHome() {
    this.router.navigate(['/']);
  }
}

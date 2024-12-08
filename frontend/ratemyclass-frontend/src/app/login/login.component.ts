import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Login } from '../login';
import { supervisor } from '../storage.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, HttpClientModule],
  providers: [ApiService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private apiService: ApiService) {
    // Initialize the FormGroup with form controls
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  getEmail() {
    return this.loginForm.get('email')?.value || '';
  }

  getPassword() {
    return this.loginForm.get('password')?.value || '';
  }

  // Submit handler
  onSubmit(): void {
    if (this.loginForm.valid) {
      const payload = {
        email: this.getEmail(),
        password: this.getPassword()
      };
      
      console.log(payload)

      this.apiService.sendLogin(payload)
        .subscribe((response: Login) => {       
          supervisor.setItem('username', response.username, 1440);
          supervisor.setItem('token', response.accessToken, 1440);
          this.router.navigate(['/']);
        });
    } else {
      console.log('Form is invalid');
    }
  }
}
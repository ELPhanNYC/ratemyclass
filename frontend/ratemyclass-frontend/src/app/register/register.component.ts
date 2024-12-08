import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  providers: [ApiService],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private apiService: ApiService) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  get username() {
    return this.registerForm.get("username");
  }

  get email() {
    return this.registerForm.get("email");
  }

  get password() {
    return this.registerForm.get("password");
  }

  getUsername() {
    return this.registerForm.get("username")?.value || '';
  }

  getEmail() {
    return this.registerForm.get("email")?.value || '';
  }

  getPassword() {
    return this.registerForm.get("password")?.value|| '';
  }

  getConfirmedPassword() {
    return this.registerForm.get("passwordConfirm")?.value|| '';
  }


  passwordMatchValidator(form: FormGroup): null | object {
    const password = form.get("password")?.value;
    const confirmPassword = form.get("confirmPassword")?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }
  
  onSubmit(): void {
    if (this.registerForm.valid) {
      const payload = {
        email: this.getEmail(),
        username: this.getUsername(),
        password: this.getPassword()
      };
      
      console.log(payload)

      this.apiService.sendRegister(payload)
        .subscribe(response => {
          alert('Registration Successful!');
          this.router.navigate(['/login']);
        }, error => {
          console.error('Error:', error);
        });
    } else {
      console.log('Form is invalid:', this.registerForm.errors);
    }
  }
}

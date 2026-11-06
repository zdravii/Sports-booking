import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { StrongPasswordValidator } from '../../core/validators/passwordValidator';
import { FormInput } from '../shared/form-input/form-input';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormInput],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  errorMessage = signal<string | null>(null);
  isSubmitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, StrongPasswordValidator()]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message ?? 'Login failed,please check your credentials');
      },
    });
  }

  get email() {
    return this.loginForm.get('email') as FormControl;
  }

  get password() {
    return this.loginForm.get('password') as FormControl;
  }

  get passwordErrorMessage(): string | null {
    const errors = this.password?.errors;
    if (!errors) return null;

    if (errors['required']) return 'Password is required';
    if (errors['minLength']) return 'Password must be at least 8 characters';
    if (errors['lowercase']) return 'Password must contain a lowercase letter';
    if (errors['uppercase']) return 'Password must contain an uppercase letter';
    if (errors['digit']) return 'Password must contain a number';

    return null;
  }
}

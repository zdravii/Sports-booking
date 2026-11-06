import { Component, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { StrongPasswordValidator } from '../../core/validators/passwordValidator';
import { firstNameValidator } from '../../core/validators/firstNameValidator';
import { lastNameValidator } from '../../core/validators/lastNameValidator';
import { FormInput } from '../shared/form-input/form-input';

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, FormInput],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;
  errorMessage = signal<string | null>(null);
  isSubmitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router,
  ) {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required, firstNameValidator()]],
        lastName: ['', [Validators.required, lastNameValidator()]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, StrongPasswordValidator()]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator },
    );
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const { firstName, lastName, email, password } = this.registerForm.value;

    this.authService.register({ firstName, lastName, email, password }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message ?? 'Registration failed. Please try again');
      },
    });
  }

  get firstName() {
    return this.registerForm.get('firstName') as FormControl;
  }
  get lastName() {
    return this.registerForm.get('lastName') as FormControl;
  }
  get email() {
    return this.registerForm.get('email') as FormControl;
  }
  get password() {
    return this.registerForm.get('password') as FormControl;
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword') as FormControl;
  }

  get firstNameErrorMessage(): string | null {
    const errors = this.firstName?.errors;
    if (!errors) return null;

    if (errors['required']) return 'First name is required';
    if (errors['minLength']) return 'First name must be at least 3 characters';
    if (errors['maxLength']) return 'First name cannot contain more than 25 characters';
    if (errors['capital']) return 'First character must be uppercase';

    return null;
  }

  get LastNameErrorMessage(): string | null {
    const errors = this.lastName?.errors;
    if (!errors) return null;

    if (errors['required']) return 'Last name is required';
    if (errors['minLength']) return 'Last name must be at least 4 characters';
    if (errors['maxLength']) return 'Last name cannot contain more than 50 characters';
    if (errors['capital']) return 'First character must be uppercase';

    return null;
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

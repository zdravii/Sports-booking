import { Component, signal } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Center } from '../../../../services/center';
import { Router } from '@angular/router';
import { CreateCenterDTO } from '../../../../models/center/create-center';
import { FormInput } from "../../../shared/form-input/form-input";

@Component({
  selector: 'app-center-create',
  imports: [ReactiveFormsModule, FormInput],
  templateUrl: './center-create.html',
  styleUrl: './center-create.css',
})
export class CenterCreate {
  createForm: FormGroup;
  errorMessage = signal<string | null>(null);
  isSubmitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private centerService: Center,
    private router: Router,
  ) {
    this.createForm = fb.group({
      name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
      address: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  onSubmit() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const request: CreateCenterDTO = this.createForm.value;

    this.centerService.createCenter(request).subscribe({
      next: () => {
        console.log(this.createForm.value);
        this.isSubmitting.set(false);
        this.router.navigate(['/admin/centers']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        console.log(err.error);
        this.errorMessage.set(err.error?.message ?? 'Cannot create center');
      },
    });
  }

  get name(){
    return this.createForm.get('name') as FormControl;
  }

  get address(){
    return this.createForm.get('address') as FormControl;
  }
}
